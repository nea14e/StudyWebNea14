namespace Backend.Dtos.DbTaskRunner;

public record DbTaskExampleListItemDto(
    string Key,
    string? Title,
    int? Order,
    string? DescriptionHtml);