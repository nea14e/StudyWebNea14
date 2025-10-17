using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities.DbTaskRunner;

[Table("db_task_items", Schema = "db_task_runner")]
[PrimaryKey("Id")]
public class DbTaskItem
{
    [Column("id")]
    public Guid Id { get; set; } // TODO

    [Column("process_id")]
    public Guid ProcessId { get; set; }

    [ForeignKey("ProcessId")]
    public DbTaskProcess Process { get; set; }

    [Column("order")]
    public int Order { get; set; }

    [Column("type")]
    public string Type { get; set; }

    [Column("sql")]
    public string? Sql { get; set; }

    [Column("frontend_html")]
    public string? FrontendHtml { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }
};