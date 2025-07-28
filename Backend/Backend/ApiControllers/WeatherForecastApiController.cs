using Backend.Dtos;
using Backend.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/weather-forecast/")]
public class WeatherForecastApiController(IWeatherForecastService service) : ControllerBase
{
    [HttpGet("get-random-list")]
    public WeatherForecast[] GetRandomList()
    {
        var result = service.GetRandomList();
        return result;
    }
}