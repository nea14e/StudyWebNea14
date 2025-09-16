namespace Backend.Dtos.DbTaskRunner;

public record DbTaskProcessDto(int ProcessNumber, List<DbTaskItemDto> TaskItems);