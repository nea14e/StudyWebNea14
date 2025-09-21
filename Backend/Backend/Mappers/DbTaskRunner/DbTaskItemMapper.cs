using Backend.Dtos.DbTaskRunner;
using Backend.Entities.DbTaskRunner;
using Backend.LogicEntities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskItemMapper
{
    public static DbTaskItemLe EntityToLe(this DbTaskItem entity)
    {
        var le = new DbTaskItemLe
        {
            Id = entity.Id,
            ProcessId = entity.ProcessId,
            Order = entity.Order,
            Type = DbTaskItemTypeMapper.EntityToLe(entity.Type),
            Sql = entity.Sql,
            FrontendHtml = entity.FrontendHtml,
            State = DbTaskItemStateLe.NotStarted
        };
        return le;
    }

    public static DbTaskItemDto LeToDto(this DbTaskItemLe le)
    {
        var dto = new DbTaskItemDto(
            le.Sql,
            le.FrontendHtml,
            le.State.LeToDto()
        );
        return dto;
    }
}