using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities.DbTaskRunner;

[Table("db_task_processes", Schema = "db_task_runner")]
[PrimaryKey("Id")]
public class DbTaskProcess
{
    [Column("id")]
    public Guid Id { get; set; }

    [Column("example_key")]
    public string ExampleKey { get; set; }

    [ForeignKey("ExampleKey")]
    public DbTaskExample Example { get; set; }

    [Column("process_number")]
    public int ProcessNumber { get; set; }

    [Column("is_deleted")]
    public bool IsDeleted { get; set; }

    public List<DbTaskItem> TaskItems { get; set; }
}