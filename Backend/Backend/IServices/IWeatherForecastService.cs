using Backend.Dtos;

namespace Backend.IServices;

public interface IWeatherForecastService
{
    public WeatherForecastListItemDto[] GetRandomList();
}