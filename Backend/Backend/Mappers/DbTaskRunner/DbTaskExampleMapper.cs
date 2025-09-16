using Backend.Dtos.DbTaskRunner;
using Backend.Entities.DbTaskRunner;
using Backend.LogicEntities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskExampleMapper
{
    public static DbTaskExampleLe EntityToLe(this DbTaskExample entity)
    {
        var le = new DbTaskExampleLe
        {
            Key = entity.Key,
            DescriptionHtml = entity.DescriptionHtml,
            Processes = entity.Processes.Select(proc => proc.EntityToLe())
                .ToList()
        };
        return le;
    }

    public static DbTaskExampleDto LeToDto(this DbTaskExampleLe le)
    {
        var dto = new DbTaskExampleDto(
            le.Key,
            le.DescriptionHtml,
            le.Processes.Select(proc => proc.LeToDto()).ToList()
        );
        return dto;
    }
}