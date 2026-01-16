using Backend.Entities;
using Backend.IServices;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class JsonConstructorService(BackendDbContext dbContext) : IJsonConstructorService
{
    private const int Delay = 1000;

    public async Task<string> PrettifyJsonAsync(string json)
    {
        var query = dbContext.Database.SqlQueryRaw<string>(
            // Для скалярных значений EF Core требует, чтобы значение было в колонке s.Value
            "SELECT s.\"Value\" FROM (SELECT jsonb_pretty({0}::jsonb)) s(\"Value\")",
            json
        );
        var result = await query.FirstAsync();
        Thread.Sleep(Delay);
        return result;
    }
}