using Backend.Dtos.DbTaskRunner;
using Backend.Entities.DbTaskRunner;
using Backend.LogicEntities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskSnippetMapper
{
    public static DbTaskSnippetLe EntityToLe(this DbTaskSnippet entity)
    {
        var le = new DbTaskSnippetLe
        {
            Key = entity.Key,
            Order = entity.Order,
            DescriptionHtml = entity.DescriptionHtml,
            IsDeleted = entity.IsDeleted,
            Processes = entity.Processes.Select(proc => proc.EntityToLe())
                .ToList()
        };
        return le;
    }

    public static DbTaskSnippetDto LeToDto(this DbTaskSnippetLe le)
    {
        var dto = new DbTaskSnippetDto(
            le.Key,
            le.Order,
            le.DescriptionHtml,
            le.Processes.Select(proc => proc.LeToDto()).ToList()
        );
        return dto;
    }
}