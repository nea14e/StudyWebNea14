using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/simple-request/")]
public class SimpleRequestApiController : ControllerBase
{
    [HttpGet("get")]
    public IActionResult Get()
    {
        // Строка по умолчанию не может распарситься в JSON. Поэтому тут JsonResult, а не string
        return new JsonResult("Привет, мир!");
    }
}