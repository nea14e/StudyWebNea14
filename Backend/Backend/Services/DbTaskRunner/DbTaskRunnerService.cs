using System.ComponentModel;
using Backend.Dtos.DbTaskRunner;
using Backend.Entities;
using Backend.Entities.DbTaskRunner;
using Backend.IServices.DbTaskRunner;
using Backend.Mappers.DbTaskRunner;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.DbTaskRunner;

public class DbTaskRunnerService(BackendDbContext dbContext) : IDbTaskRunnerService
{
    private readonly Dictionary<Guid, List<List<DbTaskItem>>> _tasks = new();

    public async Task LoadExample(Guid instanceId, string exampleKey)
    {
        if (_tasks.ContainsKey(instanceId))
        {
            _tasks.Remove(instanceId);
        }

        var tasks = await dbContext.DbTaskItems
            .Where(item => item.ExampleKey == exampleKey)
            .GroupBy(item => item.ProcessNumber)
            .OrderBy(group => group.Key)
            .Select(group => group.OrderBy(item => item.Order).ToList())
            .ToListAsync();

        if (!tasks.Any())
        {
            throw new ArgumentOutOfRangeException(nameof(exampleKey), exampleKey, "В БД нет примера с данным ключом.");
        }

        _tasks[instanceId] = tasks;
    }

    public List<List<DbTaskItemDto>> GetProgress(Guid instanceId)
    {
        if (!_tasks.ContainsKey(instanceId))
        {
            throw new InvalidAsynchronousStateException("Сначала приготовьте задачи с помощью LoadExample().");
        }

        var dtos = _tasks[instanceId]
            .Select(processTasksList => processTasksList.Select(task => task.EntityToDto()).ToList())
            .ToList();
        return dtos;
    }
}