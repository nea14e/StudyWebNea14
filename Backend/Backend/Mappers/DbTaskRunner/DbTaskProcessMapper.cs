using Backend.Dtos.DbTaskRunner;
using Backend.Entities.DbTaskRunner;
using Backend.LogicEntities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskProcessMapper
{
    public static DbTaskProcessLe EntityToLe(this DbTaskProcess entity)
    {
        var le = new DbTaskProcessLe
        {
            Id = entity.Id,
            ExampleKey = entity.ExampleKey,
            ProcessNumber = entity.ProcessNumber,
            IsDeleted = entity.IsDeleted,
            TaskItems = entity.TaskItems.Select(item => item.EntityToLe())
                .ToList()
        };
        return le;
    }

    public static DbTaskProcessDto LeToDto(this DbTaskProcessLe le)
    {
        var dto = new DbTaskProcessDto(
            le.ProcessNumber,
            le.TaskItems.Select(item => item.LeToDto()).ToList()
        );
        return dto;
    }
}