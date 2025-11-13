using Backend.IServices.Iterator;

namespace Backend.Services.Iterator;

public class IteratorService : IIteratorService
{
    private static readonly Dictionary<Guid, IEnumerator<int>> StatesBySessions = new();

    public void CreateEnumerator(Guid sessionId, int from, int to)
    {
        StatesBySessions[sessionId] = new SimpleEnumerator(from, to);
    }

    public bool MoveNext(Guid sessionId)
    {
        var enumerator = GetEnumerator(sessionId);
        return enumerator.MoveNext();
    }

    public int GetCurrent(Guid sessionId)
    {
        var enumerator = GetEnumerator(sessionId);
        return enumerator.Current;
    }

    public void Reset(Guid sessionId)
    {
        var enumerator = GetEnumerator(sessionId);
        enumerator.Reset();
    }

    private static IEnumerator<int> GetEnumerator(Guid sessionId)
    {
        if (!StatesBySessions.TryGetValue(sessionId, out var enumerator))
            throw new InvalidOperationException("Сначала вызовите метод CreateEnumerator()!");
        return enumerator;
    }
}