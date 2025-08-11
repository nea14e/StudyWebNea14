using Backend.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/simple-request-2/")]
public class SimpleRequest2ApiController(ISimpleRequest2Service service) : ControllerBase
{
    [HttpGet("get")]
    public IActionResult Get()
    {
        var result = service.Get(); // По-хорошему любые вычисления нужно делать в сервисах
        return new JsonResult(result);
    }
}