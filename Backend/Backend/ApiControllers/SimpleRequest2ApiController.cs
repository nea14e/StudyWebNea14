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
        // По-хорошему любые вычисления нужно делать в сервисах
        var result = service.Get(); // Нажмите на Get() мышкой с Ctrl, чтобы перейти дальше
        return new JsonResult(result); // А это системный класс, на него можно не переходить
    }
}