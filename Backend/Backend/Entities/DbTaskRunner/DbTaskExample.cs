using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities.DbTaskRunner;

[Table("db_task_examples", Schema = "db_task_runner")]
[PrimaryKey("Key")]
public class DbTaskExample
{
    [Column("key")]
    public string Key { get; set; }

    [Column("title")]
    public string? Title { get; set; }

    [Column("order")]
    public int? Order { get; set; }

    [Column("description_html")]
    public string? DescriptionHtml { get; set; }

    public List<DbTaskSnippet> Snippets { get; set; }
}