using Backend.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/json-constructor/")]
public class JsonConstructorApiController(IJsonConstructorService service) : ControllerBase
{
    [HttpPost("prettify")]
    public async Task<ActionResult<string>> Prettify([FromBody] string json)
    {
        var result = await service.PrettifyJsonAsync(json);
        return new JsonResult(result);
    }
}