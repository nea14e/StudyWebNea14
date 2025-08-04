using System.Data;
using Backend.Dtos;
using Backend.Entities;
using Backend.IServices;
using Backend.Mappers;

namespace Backend.Services;

public class CrudExampleService : ICrudExampleService
{
    private IList<CrudExampleInMemory> _inMemoryData =
    [
        new CrudExampleInMemory
        {
            Id = Guid.Parse("111c4442-f9e2-4c9c-953a-7c25787a6111"),
            Name = "Первая запись",
            Description = "Описание первой записи"
        },
        new CrudExampleInMemory
        {
            Id = Guid.Parse("222c4442-f9e2-4c9c-953a-7c25787a6222"),
            Name = "Вторая запись",
            Description = "Описание второй записи"
        },
        new CrudExampleInMemory
        {
            Id = Guid.Parse("333c4442-f9e2-4c9c-953a-7c25787a6333"),
            Name = "Третья запись",
            Description = "Описание третьей записи"
        }
    ];

    public IList<CrudExampleListItemDto> GetList()
    {
        var listDtos = _inMemoryData.Select(entity => entity.EntityToItemDto())
            .ToList();
        return listDtos;
    }

    public void Create(CrudExampleDetailsDto detailsDto)
    {
        if (_inMemoryData.Any(entity => entity.Id == detailsDto.Id))
            throw new ConstraintException($"Сущность с первичным ключём Id = \"{detailsDto.Id}\" уже существует!");

        var entity = new CrudExampleInMemory();
        entity = detailsDto.DetailsDtoToEntity(entity);
        _inMemoryData.Add(entity);
    }

    public CrudExampleDetailsDto Read(Guid id)
    {
        if (_inMemoryData.Any(entity => entity.Id == id) == false)
            throw new KeyNotFoundException($"Сущность с первичным ключём Id = \"{id}\" не найдена!");

        var entity = _inMemoryData.Single(entity => entity.Id == id);
        var detailsDto = entity.EntityToDetailsDto();
        return detailsDto;
    }

    public void Update(CrudExampleDetailsDto detailsDto)
    {
        var id = detailsDto.Id;

        if (_inMemoryData.Any(entity => entity.Id == id) == false)
            throw new KeyNotFoundException($"Сущность с первичным ключём Id = \"{id}\" не найдена!");

        var entity = _inMemoryData.Single(entity => entity.Id == id);
        detailsDto.DetailsDtoToEntity(entity);
    }

    public void Delete(Guid id)
    {
        if (_inMemoryData.Any(entity => entity.Id == id) == false)
            throw new KeyNotFoundException($"Сущность с первичным ключём Id = \"{id}\" не найдена!");

        var entity = _inMemoryData.Single(entity => entity.Id == id);
        _inMemoryData.Remove(entity);
    }
}