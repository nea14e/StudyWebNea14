using Backend.Dtos.DbTaskRunner;
using Backend.IServices.DbTaskRunner;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers.DbTaskRunner;

[ApiController]
[Route("api/db-task-runner/")]
public class DbTaskRunnerApiController(IDbTaskRunnerService service) : ControllerBase
{
    [HttpGet("example-list")]
    public async Task<List<DbTaskExampleListItemDto>> GetExampleList()
    {
        var result = await service.GetExampleList();
        return result;
    }

    [HttpGet("load-example")]
    public async Task<IActionResult> LoadExample(Guid instanceId, string exampleKey)
    {
        await service.LoadExample(instanceId, exampleKey);
        return Ok();
    }

    [HttpGet("run-snippet")]
    public async Task<IActionResult> RunSnippet(Guid instanceId, string snippetKey)
    {
        await service.RunSnippet(instanceId, snippetKey);
        return Ok();
    }

    [HttpGet("get-progress")]
    public DbTaskExampleDto GetProgress(Guid instanceId)
    {
        var result = service.GetProgress(instanceId);
        return result;
    }
}