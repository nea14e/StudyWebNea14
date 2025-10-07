using System.ComponentModel;
using System.Data;
using System.Data.Common;
using Backend.Dtos.DbTaskRunner;
using Backend.Entities;
using Backend.IServices.DbTaskRunner;
using Backend.LogicEntities.DbTaskRunner;
using Backend.Mappers.DbTaskRunner;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.DbTaskRunner;

public class DbTaskRunnerService(BackendDbContext dbContext) : IDbTaskRunnerService
{
    private readonly Dictionary<Guid, DbTaskExampleLe> _examples = new();

    public async Task LoadExample(Guid instanceId, string exampleKey)
    {
        if (_examples.ContainsKey(instanceId))
        {
            _examples.Remove(instanceId);
        }

        var example = await dbContext.DbTaskExamples
            .Where(ex => ex.Key == exampleKey)
            .Include(ex => ex.Snippets)
            .ThenInclude(sn => sn.Processes)
            .ThenInclude(proc => proc.TaskItems)
            .FirstOrDefaultAsync();

        if (example == null)
        {
            throw new ArgumentOutOfRangeException(nameof(exampleKey), exampleKey, "В БД нет примера с данным ключом.");
        }

        // TODO переделать на уровне настроек БД
        example.Snippets = example.Snippets
            .Where(sn => sn.IsDeleted == false)
            .OrderBy(sn => sn.Order)
            .ToList();
        foreach (var snippet in example.Snippets)
        {
            snippet.Processes = snippet.Processes
                .Where(proc => proc.IsDeleted == false)
                .OrderBy(proc => proc.ProcessNumber)
                .ToList();
            foreach (var process in snippet.Processes)
            {
                process.TaskItems = process.TaskItems
                    .Where(item => item.IsDeleted == false)
                    .OrderBy(item => item.Order)
                    .ToList();
            }
        }

        var exampleLe = example.EntityToLe();
        _examples[instanceId] = exampleLe;
    }

    public async Task RunSnippet(Guid instanceId, string snippetKey)
    {
        if (!_examples.TryGetValue(instanceId, out var example))
        {
            throw new InvalidAsynchronousStateException("Сначала приготовьте задачи с помощью LoadExample().");
        }

        if (example.RunningSnippet != null)
        {
            throw new InvalidAsynchronousStateException("Сначала дождитесь завершения предыдущего наброска кода.");
        }

        var snippet = example.Snippets.FirstOrDefault(sn => sn.Key == snippetKey);
        if (snippet == null)
        {
            throw new ArgumentOutOfRangeException(nameof(snippetKey), snippetKey,
                "Такого наброска кода в текущем примере не существует.");
        }

        example.RunningSnippet = snippet;
        foreach (var process in snippet.Processes)
        {
            // Очищаем старые, т.к. новые могут и не запуститься
            if (process.DbTransaction != null)
            {
                await process.DbTransaction.DisposeAsync();
                process.DbTransaction = null;
            }

            if (process.DbConnection != null)
            {
                if (process.DbConnection.State != ConnectionState.Closed)
                    await process.DbConnection.CloseAsync();
                await process.DbConnection.DisposeAsync();
                process.DbConnection = null;
            }

            if (process.DbContext != null)
            {
                await process.DbContext.DisposeAsync();
                process.DbContext = null;
            }

            process.RunningTaskItem = null;
            process.RunningTask = null;
            process.TaskItems.ForEach(taskItem =>
            {
                taskItem.State = DbTaskItemStateLe.NotStarted;
                taskItem.ExceptionMessage = null;
                taskItem.Result = null;
                taskItem.StartTime = null;
                taskItem.EndTime = null;
            });

            var firstItem = process.TaskItems
                .OrderBy(item => item.Order)
                .FirstOrDefault();
            if (firstItem == null)
            {
                continue;
            }

            // Запуск
            await _runTaskItem(example, snippet, process, firstItem);
        }

        // Если запускать было нечего, то сразу считаем сниппет завершённым
        if (snippet.Processes.All(proc => !proc.TaskItems.Any() || proc.RunningTaskItem == null))
        {
            example.RunningSnippet = null;
        }
    }

    private async Task _runTaskItem(DbTaskExampleLe example, DbTaskSnippetLe snippet, DbTaskProcessLe process,
        DbTaskItemLe taskItem)
    {
        process.DbContext ??= new BackendDbContext();
        if (process.DbConnection == null)
        {
            process.DbConnection = process.DbContext.Database.GetDbConnection();
            await process.DbConnection.OpenAsync();
        }

        switch (taskItem.Type)
        {
            case DbTaskItemTypeLe.BeginTransaction:
                if (process.DbTransaction != null)
                    throw new InvalidAsynchronousStateException(
                        $"Процесс {process.Id} уже внутри транзакции! Команда {taskItem.Id}.");
                process.DbTransaction = await process.DbConnection.BeginTransactionAsync();
                taskItem.State = DbTaskItemStateLe.Completed;
                taskItem.ExceptionMessage = null;
                taskItem.Result = null;
                await _goToNextTaskItem(example, snippet, process, taskItem);
                return;
            case DbTaskItemTypeLe.CommitTransaction:
                if (process.DbTransaction == null)
                    throw new InvalidAsynchronousStateException(
                        $"Процесс {process.Id} уже вне транзакции! Команда {taskItem.Id}.");
                await process.DbTransaction.CommitAsync();
                await process.DbTransaction.DisposeAsync();
                process.DbTransaction = null;
                taskItem.State = DbTaskItemStateLe.Completed;
                taskItem.ExceptionMessage = null;
                taskItem.Result = null;
                await _goToNextTaskItem(example, snippet, process, taskItem);
                return;
            case DbTaskItemTypeLe.RollbackTransaction:
                if (process.DbTransaction == null)
                    throw new InvalidAsynchronousStateException(
                        $"Процесс {process.Id} уже вне транзакции! Команда {taskItem.Id}.");
                await process.DbTransaction.RollbackAsync();
                await process.DbTransaction.DisposeAsync();
                process.DbTransaction = null;
                taskItem.State = DbTaskItemStateLe.Completed;
                taskItem.ExceptionMessage = null;
                taskItem.Result = null;
                await _goToNextTaskItem(example, snippet, process, taskItem);
                return;
        }

        // Иначе DbTaskItemTypeLe.Query / NonQuery:
        if (taskItem.Sql == null)
            throw new InvalidOperationException($"Задача Id = {taskItem.Id}, Type = {taskItem.Type}" +
                                                $" содержит Sql = null (несовместимая комбинация)!");

        taskItem.State = DbTaskItemStateLe.Running;
        taskItem.ExceptionMessage = null;
        taskItem.Result = null;
        taskItem.StartTime = DateTime.Now;
        process.RunningTaskItem = taskItem; // Важен порядок строк в коде!

        var command = process.DbConnection.CreateCommand();
        command.CommandText = taskItem.Sql;
        Func<Task, Task<List<List<object?>>?>> readResultsFunc = taskItem.Type switch
        {
            DbTaskItemTypeLe.Table => async task1 =>
            {
                var task2 = (Task<DbDataReader>)task1;
                var reader = task2.Result;
                var table = new List<List<object?>>();
                while (reader.Read())
                {
                    var row = new List<object?>();
                    for (var i = 0; i < reader.FieldCount; i++)
                    {
                        var value = reader[i];
                        value = value switch
                        {
                            DBNull => null,
                            DateTime value1 => value1.ToString("O"),
                            DateOnly value2 => value2.ToString("yyyy-MM-dd"),
                            _ => value
                        };
                        row.Add(value);
                    }

                    table.Add(row);
                }

                await reader.CloseAsync();
                await reader.DisposeAsync();
                return table;
            },
            DbTaskItemTypeLe.Scalar => async task1 =>
            {
                var task2 = (Task<object?>)task1;
                var value = task2.Result;
                return [[value]];
            },
            DbTaskItemTypeLe.NonQuery => async _ => null,
            _ => throw new InvalidOperationException($"Тип задачи Id = {taskItem.Id}, Type = {taskItem.Type}" +
                                                     $" не предусмотрен!")
        };

        process.RunningTask = ((Task)(taskItem.Type switch
            {
                DbTaskItemTypeLe.Table => command.ExecuteReaderAsync(),
                DbTaskItemTypeLe.Scalar => command.ExecuteScalarAsync(),
                DbTaskItemTypeLe.NonQuery => command.ExecuteNonQueryAsync(),
                _ => throw new InvalidOperationException($"Тип задачи Id = {taskItem.Id}, Type = {taskItem.Type}" +
                                                         $" не предусмотрен!")
            }))
            .ContinueWith(async (task1, _) =>
            {
                if (task1.Status == TaskStatus.RanToCompletion)
                {
                    taskItem.State = DbTaskItemStateLe.Completed;
                    taskItem.ExceptionMessage = null;
                    taskItem.Result = await readResultsFunc(task1);
                    taskItem.EndTime = DateTime.Now;
                    await command.DisposeAsync();
                    await _goToNextTaskItem(example, snippet, process, taskItem);
                }
                else
                {
                    taskItem.State = DbTaskItemStateLe.Error;
                    taskItem.ExceptionMessage = task1.Exception?.InnerException?.Message ?? task1.Status.ToString();
                    taskItem.Result = null;
                    taskItem.EndTime = DateTime.Now;
                    await command.DisposeAsync();
                    await _completeProcess(example, snippet, process);
                }
            }, null);
    }

    private async Task _goToNextTaskItem(DbTaskExampleLe example, DbTaskSnippetLe snippet, DbTaskProcessLe process,
        DbTaskItemLe taskItem)
    {
        var nextTaskItem = process.TaskItems
            .OrderBy(item => item.Order)
            .FirstOrDefault(item => item.Order > taskItem.Order);
        if (nextTaskItem != null)
        {
            await _runTaskItem(example, snippet, process, nextTaskItem);
        }
        else
        {
            await _completeProcess(example, snippet, process);
        }
    }

    private static async Task _completeProcess(DbTaskExampleLe example, DbTaskSnippetLe snippet,
        DbTaskProcessLe process)
    {
        process.RunningTaskItem = null;
        process.RunningTask = null;
        if (process.DbTransaction != null)
        {
            try
            {
                await process.DbTransaction.CommitAsync();
            }
            catch (Exception)
            {
                await process.DbTransaction.RollbackAsync();
            }

            await process.DbTransaction.DisposeAsync();
            process.DbTransaction = null;
        }

        if (process.DbConnection != null)
        {
            if (process.DbConnection.State != ConnectionState.Closed)
                await process.DbConnection.CloseAsync();
            await process.DbConnection.DisposeAsync();
            process.DbConnection = null;
        }

        if (process.DbContext != null)
        {
            await process.DbContext.DisposeAsync();
            process.DbContext = null;
        }

        if (snippet.Processes.All(proc => !proc.TaskItems.Any() || proc.RunningTaskItem == null))
        {
            example.RunningSnippet = null;
        }
    }

    public DbTaskExampleDto GetProgress(Guid instanceId)
    {
        if (!_examples.TryGetValue(instanceId, out var example))
        {
            throw new InvalidAsynchronousStateException("Сначала приготовьте задачи с помощью LoadExample().");
        }

        var dto = example.LeToDto();
        return dto;
    }
}