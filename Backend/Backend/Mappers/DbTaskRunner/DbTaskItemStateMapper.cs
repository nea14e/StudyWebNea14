using Backend.Dtos.DbTaskRunner;
using Backend.LogicEntities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskItemStateMapper
{
    public static string LeToDto(this DbTaskItemStateLe le)
    {
        var dto = le switch
        {
            DbTaskItemStateLe.NotStarted => DbTaskItemStateDto.NotStarted,
            DbTaskItemStateLe.Running => DbTaskItemStateDto.Running,
            DbTaskItemStateLe.Completed => DbTaskItemStateDto.Completed,
            DbTaskItemStateLe.Error => DbTaskItemStateDto.Error,
            _ => throw new ArgumentOutOfRangeException(nameof(le), le, null)
        };
        return dto;
    }
}