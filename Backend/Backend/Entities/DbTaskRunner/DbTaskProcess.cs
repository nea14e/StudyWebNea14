using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Entities.DbTaskRunner;

public class DbTaskProcess
{
    public Guid Id { get; set; }

    public string ExampleKey { get; set; }
    public string SnippetKey { get; set; }
    public DbTaskSnippet Snippet { get; set; }

    public int ProcessNumber { get; set; }

    public bool IsDeleted { get; set; }

    public List<DbTaskItem> TaskItems { get; set; }

    public class DbTaskProcessConfiguration : IEntityTypeConfiguration<DbTaskProcess>
    {
        public void Configure(EntityTypeBuilder<DbTaskProcess> builder)
        {
            builder.ToTable("db_task_processes", "db_task_runner");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .HasColumnName("id");
            builder.Property(x => x.ExampleKey)
                .HasMaxLength(20)
                .IsRequired()
                .HasColumnName("example_key");
            builder.Property(x => x.SnippetKey)
                .HasMaxLength(20)
                .IsRequired()
                .HasColumnName("snippet_key");
            builder.Property(x => x.ProcessNumber)
                .IsRequired()
                .HasColumnName("process_number");
            builder.Property(x => x.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            builder.HasMany(x => x.TaskItems)
                .WithOne(y => y.Process)
                .HasForeignKey(y => y.ProcessId);
        }
    }
}