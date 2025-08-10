using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/simple-request/")]
public class SimpleRequestApiController : ControllerBase
{
    [HttpGet("get")]
    public IActionResult Get()
    {
        // Метод должен возвращать не просто данные, а ответ на сетевой запрос. Поэтому тут JsonResult, а не string
        return new JsonResult("Привет, мир!");
    }
}