namespace Backend.Dtos.DbTaskRunner;

public record DbTaskExampleDto(string Key, string DescriptionHtml, List<DbTaskProcessDto> Processes);