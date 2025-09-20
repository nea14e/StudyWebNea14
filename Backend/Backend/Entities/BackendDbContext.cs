using Backend.Entities.DbTaskRunner;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities;

public class BackendDbContext : DbContext
{
    public DbSet<DbTaskExample> DbTaskExamples { get; set; }

    public DbSet<DbTaskProcess> DbTaskProcesses { get; set; }

    public DbSet<DbTaskItem> DbTaskItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=12345");
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BackendDbContext).Assembly);
    }
}