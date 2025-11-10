using Backend.Dtos;

namespace Backend.SimpleExamples;

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