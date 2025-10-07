namespace Backend.Dtos.DbTaskRunner;

public record DbTaskItemDto(
    Guid Id,
    string? Sql,
    string FrontendHtml,
    string Type,
    string State,
    string? ExceptionMessage,
    List<List<object?>>? Result,
    DateTime? ProcessStartTime,
    DateTime? StartTime,
    DateTime? EndTime);