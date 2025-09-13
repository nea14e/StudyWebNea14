using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities.DbTaskRunner;

[Table("tasks", Schema = "db_task_runner")]
public class DbTaskItem
{
    [Column("id")] public Guid Id { get; set; } // TODO

    [Column("example_key")] public string ExampleKey { get; set; }

    [Column("process_number")] public int ProcessNumber { get; set; }

    [Column("order")] public int Order { get; set; }

    [Column("sql")] public string Sql { get; set; }

    [Column("frontend_html")] public string FrontendHtml { get; set; }

    [NotMapped] public DbTaskItemState State = DbTaskItemState.NotStarted;
};