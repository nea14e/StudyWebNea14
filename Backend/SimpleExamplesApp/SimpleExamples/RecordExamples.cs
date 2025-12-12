namespace SimpleExamplesApp.SimpleExamples;

public static class RecordExamples
{
    public static void ComparePrivateFields()
    {
        var obj1 = new TestRecord(Guid.Empty, "First");
        Console.WriteLine("TestRecord1: " + obj1);
        var obj2 = new TestRecord(Guid.Empty, "First");
        Console.WriteLine("TestRecord2: " + obj2);
        Console.WriteLine("TestRecord1 == TestRecord2: " +
                          (obj1 == obj2));
    }
}

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