using Backend.Dtos;

namespace Backend.IServices;

public interface IWeatherForecastService
{
    public WeatherForecast[] GetRandomList();
}