namespace Backend.Dtos;

public class RequestWithComplexParametersFilterDto
{
    public string? Title { get; set; }

    public DateOnly? DateFrom { get; set; }

    public DateOnly? DateTo { get; set; }
};