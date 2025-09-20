using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Entities.DbTaskRunner;

[PrimaryKey("ExampleKey", "Key")]
public class DbTaskSnippet
{
    public string ExampleKey { get; set; }
    public DbTaskExample Example { get; set; }

    public string Key { get; set; }

    public int Order { get; set; }

    public string? DescriptionHtml { get; set; }

    public bool IsDeleted { get; set; }

    public List<DbTaskProcess> Processes { get; set; }

    public class DbTaskSnippetConfiguration : IEntityTypeConfiguration<DbTaskSnippet>
    {
        public void Configure(EntityTypeBuilder<DbTaskSnippet> builder)
        {
            builder.ToTable("db_task_snippets", "db_task_runner");
            builder.HasKey(x => new { x.ExampleKey, x.Key });

            builder.Property(x => x.ExampleKey)
                .HasMaxLength(20)
                .IsRequired()
                .HasColumnName("example_key");
            builder.Property(x => x.Key)
                .HasMaxLength(20)
                .IsRequired()
                .HasColumnName("key");
            builder.Property(x => x.Order)
                .IsRequired()
                .HasColumnName("order");
            builder.Property(x => x.DescriptionHtml)
                .HasColumnName("description_html");
            builder.Property(x => x.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");

            builder.HasOne(x => x.Example)
                .WithMany(y => y.Snippets)
                .HasForeignKey(x => x.ExampleKey);
            builder.HasMany(x => x.Processes)
                .WithOne(y => y.Snippet)
                .HasForeignKey(y => new { y.ExampleKey, y.SnippetKey });
        }
    }
}