namespace Backend.Dtos;

public record TestRecord(Guid Id, string Name)
{
    // Это поле не выводится на печать, поскольку оно private,
    // но по-прежнему используется в сравнении объектов.
    private DateTime _constructionTime = DateTime.Now;

    public void SetSameConstructionTime(TestRecord other)
    {
        this._constructionTime = other._constructionTime;
    }
};