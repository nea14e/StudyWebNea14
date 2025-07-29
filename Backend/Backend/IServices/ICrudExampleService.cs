using Backend.Dtos;

namespace Backend.IServices;

public interface ICrudExampleService
{
    public IList<CrudExampleItemDto> GetList();

    public CrudExampleDetailsDto Read(Guid id);
}