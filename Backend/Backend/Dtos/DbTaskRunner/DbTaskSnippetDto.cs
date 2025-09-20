namespace Backend.Dtos.DbTaskRunner;

public record DbTaskSnippetDto(string Key, int Order, string? DescriptionHtml, List<DbTaskProcessDto> Processes);