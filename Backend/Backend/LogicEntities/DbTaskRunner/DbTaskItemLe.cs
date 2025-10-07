namespace Backend.LogicEntities.DbTaskRunner;

public class DbTaskItemLe
{
    public Guid Id { get; set; } // TODO

    public Guid ProcessId { get; set; }

    public int Order { get; set; }

    public DbTaskItemTypeLe Type { get; set; }

    public string? Sql { get; set; }

    public string FrontendHtml { get; set; }

    public DbTaskItemStateLe State { get; set; } = DbTaskItemStateLe.NotStarted;

    public string? ExceptionMessage { get; set; }
    public List<List<object?>>? Result { get; set; }

    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
};