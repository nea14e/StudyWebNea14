using Backend.Dtos;
using Backend.IServices;

namespace Backend.Services;

public class WeatherForecastService : IWeatherForecastService
{
    private readonly string[] _summaries =
    [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    ];

    public WeatherForecastListItemDto[] GetRandomList()
    {
        var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecastListItemDto
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    _summaries[Random.Shared.Next(_summaries.Length)]
                ))
            .ToArray();

        return forecast;
    }
}