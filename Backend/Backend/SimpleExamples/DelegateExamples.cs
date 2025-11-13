namespace Backend.SimpleExamples;

public class DelegateExamples
{
    private delegate decimal Arithmetic(decimal a, decimal b);

    private static event Arithmetic OnArithmetic;

    public static void DelegateExample()
    {
        Arithmetic operation = (a, b) =>
        {
            Console.WriteLine($"DelegateExample: {a} + {b}");
            return a + b;
        };
        operation += (a, b) =>
        {
            Console.WriteLine($"DelegateExample: {a} - {b}");
            return a - b;
        };
        var result = operation(5, 6);
        Console.WriteLine($"DelegateExample: result: {result}");
    }

    public static void FuncAsDelegateExample()
    {
        Func<decimal, decimal, decimal> operation = (a, b) =>
        {
            Console.WriteLine($"FuncAsDelegateExample: {a} + {b}");
            return a + b;
        };
        operation += (a, b) =>
        {
            Console.WriteLine($"FuncAsDelegateExample: {a} - {b}");
            return a - b;
        };
        var result = operation(5, 6);
        Console.WriteLine($"FuncAsDelegateExample: result: {result}");
    }

    public static void EventExample()
    {
        OnArithmetic = (a, b) =>
        {
            Console.WriteLine($"EventExample: {a} + {b}");
            return a + b;
        };
        OnArithmetic += (a, b) =>
        {
            Console.WriteLine($"EventExample: {a} - {b}");
            return a - b;
        };
        var result = OnArithmetic(5, 6);
        Console.WriteLine($"EventExample: result: {result}");
    }
}