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
            Snippets = entity.Snippets.Select(sn => sn.EntityToLe())
                .ToList()
        };
        return le;
    }

    public static DbTaskExampleDto LeToDto(this DbTaskExampleLe le)
    {
        var dto = new DbTaskExampleDto(
            le.Key,
            le.DescriptionHtml,
            le.Snippets.Select(sn => sn.LeToDto()).ToList()
        );
        return dto;
    }
}