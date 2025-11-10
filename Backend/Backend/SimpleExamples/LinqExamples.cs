namespace Backend.SimpleExamples;

public static class LinqExamples
{
    public static void ZipExample()
    {
        List<int> list1 = [1, 2, 3, 4];
        List<string> list2 = ["first", "second", "third", "fourth"];
        var zipResult = list1.Zip(list2);
        foreach (var valueTuple in zipResult)
        {
            Console.WriteLine($"{valueTuple.First} - {valueTuple.Second}");
        }
    }
}