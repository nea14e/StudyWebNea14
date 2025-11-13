using Backend.IServices.Iterator;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers.Iterator;

[ApiController]
[Route("api/iterator/")]
public class IteratorApiController(IIteratorService service) : ControllerBase
{
    [HttpGet]
    [Route("create")]
    public IActionResult Create(Guid sessionId, int from, int to)
    {
        service.CreateEnumerator(sessionId, from, to);
        return Ok();
    }

    [HttpGet]
    [Route("move-next")]
    public IActionResult MoveNext(Guid sessionId)
    {
        var result = service.MoveNext(sessionId);
        return new JsonResult(result);
    }

    [HttpGet]
    [Route("get-current")]
    public IActionResult GetCurrent(Guid sessionId)
    {
        var result = service.GetCurrent(sessionId);
        return new JsonResult(result);
    }

    [HttpGet]
    [Route("reset")]
    public IActionResult Reset(Guid sessionId)
    {
        service.Reset(sessionId);
        return Ok();
    }
}