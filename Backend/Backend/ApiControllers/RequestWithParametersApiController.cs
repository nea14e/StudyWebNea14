using Backend.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/request-with-parameters/")]
public class RequestWithParametersApiController(IRequestWithParametersService service) : ControllerBase
{
    // Названия входных параметров могут отличаться от того, что на фронте,
    // потому что они привязаны к месту в адресе, а не к названию.
    [HttpGet("address-params/{oneParam:int}/{anotherParam:int}")]
    public IActionResult AddressParams(int oneParam, int anotherParam)
    {
        var result = service.Plus(oneParam, anotherParam);
        return new JsonResult(result);
    }

    // Входные query-параметры различаются между собой по названию,
    // поэтому их названия на бэкенде и фронтенде должны совпадать.
    [HttpGet("query-params")]
    public IActionResult QueryParams(int oneParam, int anotherParam)
    {
        var result = service.Plus(oneParam, anotherParam); // Мы можем использовать тот же метод сервиса
        return new JsonResult(result);
    }
}