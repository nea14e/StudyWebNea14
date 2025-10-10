using Backend.Dtos.DbTaskRunner;
using Backend.Entities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskExampleListItemMapper
{
    public static DbTaskExampleListItemDto EntityToListItemDto(this DbTaskExample entity)
    {
        var dto = new DbTaskExampleListItemDto(
            entity.Key,
            entity.Title,
            entity.Order,
            entity.DescriptionHtml
        );
        return dto;
    }
}