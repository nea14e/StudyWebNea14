namespace Backend.LogicEntities.DbTaskRunner;

public class DbTaskExampleLe
{
    public string Key { get; set; }

    public string DescriptionHtml { get; set; }

    public List<DbTaskProcessLe> Processes { get; set; }
}