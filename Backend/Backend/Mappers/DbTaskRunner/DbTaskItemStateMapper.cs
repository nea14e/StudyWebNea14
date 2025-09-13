using Backend.Dtos.DbTaskRunner;
using Backend.Entities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskItemStateMapper
{
    public static string EntityToDto(this DbTaskItemState entity)
    {
        return entity switch
        {
            DbTaskItemState.NotStarted => DbTaskItemStateDto.NotStarted,
            DbTaskItemState.Running => DbTaskItemStateDto.Running,
            DbTaskItemState.Completed => DbTaskItemStateDto.Completed,
            DbTaskItemState.Error => DbTaskItemStateDto.Error,
            _ => throw new ArgumentOutOfRangeException(nameof(entity), entity, "Это значение entity не предусмотрено!")
        };
    }
}