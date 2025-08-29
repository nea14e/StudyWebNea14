namespace Backend.IServices;

public interface IJsonConstructorService
{
    Task<string> PrettifyJsonAsync(string json);
}