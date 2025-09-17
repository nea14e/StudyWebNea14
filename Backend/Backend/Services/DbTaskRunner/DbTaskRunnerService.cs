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
            .Include(ex => ex.Processes)
            .ThenInclude(proc => proc.TaskItems)
            .FirstOrDefaultAsync();

        if (example == null)
        {
            throw new ArgumentOutOfRangeException(nameof(exampleKey), exampleKey, "В БД нет примера с данным ключом.");
        }

        // TODO переделать на уровне настроек БД
        example.Processes = example.Processes
            .Where(proc => proc.IsDeleted == false)
            .OrderBy(proc => proc.ProcessNumber)
            .ToList();
        example.Processes.ForEach(proc =>
        {
            proc.TaskItems = proc.TaskItems
                .Where(item => item.IsDeleted == false)
                .OrderBy(item => item.Order)
                .ToList();
        });

        var exampleLe = example.EntityToLe();
        _examples[instanceId] = exampleLe;
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