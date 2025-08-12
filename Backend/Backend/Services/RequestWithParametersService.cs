using Backend.IServices;

namespace Backend.Services;

public class RequestWithParametersService : IRequestWithParametersService
{
    public string Plus(int a, int b)
    {
        var result = a + b;
        return $"Ответ: {a} + {b} = {result}";
    }
}