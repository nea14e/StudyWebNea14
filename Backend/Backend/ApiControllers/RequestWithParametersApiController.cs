using Backend.Dtos;
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

    // Набор изо всех query-параметров можно рассматривать как составной объект, например, filter
    // Каждое поле объекта filter = 1 query-параметр
    [HttpGet("complex-params")]
    public IActionResult ComplexParams([FromQuery] RequestWithComplexParametersFilterDto filter)
    {
        var result = service.GetComplexParametersList(filter);
        return new JsonResult(result); // Результат запроса - тоже составной объект, но здесь всё как обычно
    }

    // POST-запрос получает сложные данные из тела запроса
    [HttpPost("post-request")]
    public IActionResult PostRequest([FromBody] PostRequestRequestBody requestBody)
    {
        var result = service.PostRequest(requestBody);
        return new JsonResult(result);
    }
}