using Backend.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/request-errors-example/")]
public class RequestErrorsExampleApiController(IRequestErrorsExampleService service) : ControllerBase
{
    [HttpGet("addition")]
    public int Plus(int first, int second)
    {
        var result = service.Plus(first, second);
        return result;
    }
}