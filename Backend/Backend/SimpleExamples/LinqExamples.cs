namespace Backend.SimpleExamples;

public static class LinqExamples
{
    public static void MethodsJoinExample()
    {
        Console.WriteLine("MethodsJoinExample:");
        List<int> outerList = [1, 2, 3, 4];
        List<int> innerList = [10, 30, 50];
        var result = outerList.Join(innerList, x => 10 * x, y => y, (x, y) => (x, y));
        foreach (var valueTuple in result)
        {
            Console.WriteLine(valueTuple);
        }
    }

    public static void LeftJoinExample()
    {
        Console.WriteLine("LeftJoinExample:");
        var outerList = new[]
        {
            new { Id = 1, Code = 111 },
            new { Id = 2, Code = 222 },
            new { Id = 3, Code = 333 }
        };
        var innerList = new[]
        {
            new { Id = 10, Data = "first" },
            new { Id = 30, Data = "third" },
            new { Id = 40, Data = "fourth" }
        };
        var result = from l1 in outerList
            join l2 in innerList on 10 * l1.Id equals l2.Id into joined // В joined кладутся данные l2, а не всё вместе
            from j in joined.DefaultIfEmpty()
            select new { l1.Id, l1.Code, j?.Data };
        foreach (var item in result)
        {
            Console.WriteLine($"item: {item.Id} {item.Code} {item.Data}");
        }
    }

    public static void ZipExample()
    {
        Console.WriteLine("ZipExample:");
        List<int> list1 = [1, 2, 3, 4];
        List<string> list2 = ["first", "second", "third", "fourth"];
        var zipResult = list1.Zip(list2);
        foreach (var valueTuple in zipResult)
        {
            Console.WriteLine($"{valueTuple.First} - {valueTuple.Second}");
        }
    }
}