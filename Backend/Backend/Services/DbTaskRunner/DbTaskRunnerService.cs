using System.ComponentModel;
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

    public void RunSnippet(Guid instanceId, string snippetKey)
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
            process.RunningTaskItem = null; // Очищаем старые, т.к. новые могут и не запуститься
            process.RunningTask = null;
            process.TaskItems.ForEach(taskItem =>
            {
                taskItem.State = DbTaskItemStateLe.NotStarted;
                taskItem.Exception = null;
            });

            var firstItem = process.TaskItems
                .OrderBy(item => item.Order)
                .FirstOrDefault(item => item.Sql != null);
            if (firstItem == null)
            {
                continue;
            }

            _runTaskItem(example, snippet, process, firstItem);
        }

        if (snippet.Processes.All(proc => !proc.TaskItems.Any() || proc.RunningTaskItem == null))
        {
            example.RunningSnippet = null;
        }
    }

    private void _runTaskItem(DbTaskExampleLe example, DbTaskSnippetLe snippet, DbTaskProcessLe process,
        DbTaskItemLe taskItem)
    {
        if (taskItem.Sql == null)
        {
            _goToNextTaskItem(example, snippet, process, taskItem);
            return;
        }

        taskItem.State = DbTaskItemStateLe.Running;
        taskItem.Exception = null;
        process.RunningTaskItem = taskItem; // Важен порядок строк в коде!
        process.DbContext ??= new BackendDbContext();
        process.RunningTask = process.DbContext.Database.ExecuteSqlRawAsync(taskItem.Sql)
            .ContinueWith((task, _) =>
            {
                taskItem.State = DbTaskItemStateLe.Error;
                taskItem.Exception = task.Exception;
                _completeProcess(example, snippet, process);
            }, null, TaskContinuationOptions.OnlyOnFaulted)
            .ContinueWith((task, obj) =>
            {
                taskItem.State = DbTaskItemStateLe.Completed;
                taskItem.Exception = null;
                _goToNextTaskItem(example, snippet, process, taskItem);
            }, null, TaskContinuationOptions.NotOnFaulted);
    }

    private void _goToNextTaskItem(DbTaskExampleLe example, DbTaskSnippetLe snippet, DbTaskProcessLe process,
        DbTaskItemLe taskItem)
    {
        var nextTaskItem = process.TaskItems
            .OrderBy(item => item.Order)
            .FirstOrDefault(item => item.Order > taskItem.Order && taskItem.Sql != null);
        if (nextTaskItem != null)
        {
            _runTaskItem(example, snippet, process, nextTaskItem);
        }
        else
        {
            _completeProcess(example, snippet, process);
        }
    }

    private static void _completeProcess(DbTaskExampleLe example, DbTaskSnippetLe snippet, DbTaskProcessLe process)
    {
        process.RunningTaskItem = null;
        process.RunningTask = null;
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