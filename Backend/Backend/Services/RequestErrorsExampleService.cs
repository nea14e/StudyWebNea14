using Backend.IServices;

namespace Backend.Services;

public class RequestErrorsExampleService : IRequestErrorsExampleService
{
    public int Plus(int a, int b)
    {
        return a + b;
    }

    public int Minus(int a, int b)
    {
        return a - b;
    }
}