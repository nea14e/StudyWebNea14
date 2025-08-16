using Backend.Dtos;
using Backend.IServices;

namespace Backend.Services;

public class RequestWithParametersService : IRequestWithParametersService
{
    private readonly List<RequestWithComplexParametersListItemDto> _complexParametersList =
    [
        new(
            Guid.Parse("111d33e6-85b5-4b8f-8784-f75352e54111"),
            "Первый",
            DateOnly.FromDateTime(DateTime.Now.AddDays(1))
        ),
        new(
            Guid.Parse("222d33e6-85b5-4b8f-8784-f75352e54222"),
            "Второй",
            DateOnly.FromDateTime(DateTime.Now.AddDays(2))
        ),
        new(
            Guid.Parse("333d33e6-85b5-4b8f-8784-f75352e54333"),
            "Третий",
            DateOnly.FromDateTime(DateTime.Now.AddDays(3))
        ),
        new(
            Guid.Parse("100d33e6-85b5-4b8f-8784-f75352e54100"),
            "Сотый",
            DateOnly.FromDateTime(DateTime.Now.AddDays(100))
        ),
    ];

    public string Plus(int a, int b)
    {
        var result = a + b;
        return $"Ответ: {a} + {b} = {result}";
    }

    public List<RequestWithComplexParametersListItemDto> GetComplexParametersList(
        RequestWithComplexParametersFilterDto? filter)
    {
        IEnumerable<RequestWithComplexParametersListItemDto> query = _complexParametersList;
        // Если в фильтре задан Title, то фильтруем по Title:
        if (filter?.Title != null)
            query = query.Where(x => x.Title.StartsWith(filter.Title));
        // Если в фильтре задана DateFrom, то фильтруем по DateFrom:
        if (filter?.DateFrom != null)
            query = query.Where(x => x.Date >= filter.DateFrom);
        // И так далее...
        if (filter?.DateTo != null)
            query = query.Where(x => x.Date <= filter.DateTo);

        var result = query.ToList();
        return result;
    }

    public PostRequestResponseBody PostRequest(PostRequestRequestBody requestBody)
    {
        var items = requestBody.Items;

        var count = items.Count;
        var sum = items.Sum();
        var average = items.Average();

        var result = new PostRequestResponseBody(count, sum, average);
        return result;
    }
}