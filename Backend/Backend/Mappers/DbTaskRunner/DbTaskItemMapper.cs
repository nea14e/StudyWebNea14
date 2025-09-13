using Backend.Dtos.DbTaskRunner;
using Backend.Entities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskItemMapper
{
    public static DbTaskItemDto EntityToDto(this DbTaskItem entity)
    {
        var dto = new DbTaskItemDto(
            entity.Sql,
            entity.FrontendHtml,
            entity.State.EntityToDto()
        );
        return dto;
    }
}