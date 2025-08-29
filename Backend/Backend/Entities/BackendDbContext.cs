using Microsoft.EntityFrameworkCore;

namespace Backend.Entities;

public class BackendDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=12345");
        base.OnConfiguring(optionsBuilder);
    }
}