namespace Backend.LogicEntities.DbTaskRunner;

public class DbTaskSnippetLe
{
    public string Key { get; set; }

    public int Order { get; set; }

    public string? DescriptionHtml { get; set; }

    public bool IsDeleted { get; set; }

    public List<DbTaskProcessLe> Processes { get; set; }
}