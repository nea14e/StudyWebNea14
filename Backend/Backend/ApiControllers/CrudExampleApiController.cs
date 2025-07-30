using Backend.Dtos;
using Backend.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.ApiControllers;

[ApiController]
[Route("api/crud-example/")]
public class CrudExampleApiController(ICrudExampleService service) : ControllerBase
{
    [HttpGet("get-list")]
    public IList<CrudExampleItemDto> GetList()
    {
        var result = service.GetList();
        return result;
    }

    [HttpPost("create")]
    public void Create([FromBody] CrudExampleDetailsDto detailsDto)
    {
        service.Create(detailsDto);
    }

    [HttpGet("read/{id}")]
    public CrudExampleDetailsDto Read(Guid id)
    {
        var result = service.Read(id);
        return result;
    }

    [HttpPost("update")]
    public void Update([FromBody] CrudExampleDetailsDto detailsDto)
    {
        service.Update(detailsDto);
    }
}