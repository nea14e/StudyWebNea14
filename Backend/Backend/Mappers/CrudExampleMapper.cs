using Backend.Dtos;
using Backend.Entities;

namespace Backend.Mappers;

public static class CrudExampleMapper
{
    public static CrudExampleListItemDto EntityToItemDto(this CrudExampleInMemory entity)
    {
        var itemDto = new CrudExampleListItemDto(
            entity.Id,
            entity.Name
        );
        return itemDto;
    }

    public static CrudExampleDetailsDto EntityToDetailsDto(this CrudExampleInMemory entity)
    {
        var detailsDto = new CrudExampleDetailsDto(
            entity.Id,
            entity.Name,
            entity.Description
        );
        return detailsDto;
    }

    public static CrudExampleInMemory DetailsDtoToEntity(this CrudExampleDetailsDto detailsDto,
        CrudExampleInMemory entity)
    {
        entity.Id = detailsDto.Id;
        entity.Name = detailsDto.Name;
        entity.Description = detailsDto.Description;
        return entity;
    }
}