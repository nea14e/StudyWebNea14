using Backend.IServices;

namespace Backend.Services;

public class SimpleRequest2Service : ISimpleRequest2Service
{
    public string Get()
    {
        return "Привет, мир-2!";
    }
}