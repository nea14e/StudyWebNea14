using Backend.Dtos;

namespace Backend.IServices;

public interface ICrudExampleService
{
    public IList<CrudExampleItemDto> GetList();

    public void Create(CrudExampleDetailsDto detailsDto);

    public CrudExampleDetailsDto Read(Guid id);

    public void Update(CrudExampleDetailsDto detailsDto);

    public void Delete(Guid id);
}