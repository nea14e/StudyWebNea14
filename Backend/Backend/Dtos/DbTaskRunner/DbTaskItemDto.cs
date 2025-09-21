namespace Backend.Dtos.DbTaskRunner;

public record DbTaskItemDto(string? Sql, string FrontendHtml, string State);