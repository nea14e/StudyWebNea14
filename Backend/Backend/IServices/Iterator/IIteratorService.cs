namespace Backend.IServices.Iterator;

public interface IIteratorService
{
    void CreateEnumerator(Guid sessionId, int from, int to);
    bool MoveNext(Guid sessionId);
    int GetCurrent(Guid sessionId);
    void Reset(Guid sessionId);
}