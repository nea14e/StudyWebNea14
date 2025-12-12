using SimpleExamplesApp.MyExamples.RecursiveCalculator.Operands;

namespace SimpleExamplesApp.MyExamples.RecursiveCalculator;

public static class RecursiveCalculator
{
    private static readonly Func<string, BaseOperand?>[] OperandConstructors =
    [
        NumberOperand.TryConstruct,
        Operation.TryConstruct
    ];

    public static void Run()
    {
        var root = InputOperand();
        while (true)
        {
            var wasUnfilledFound = false;
            var currentStateString = root.Print(ref wasUnfilledFound, out var hasUnfilled);
            Console.WriteLine(currentStateString);
            if (!hasUnfilled)
            {
                var result = root.Calculate();
                Console.WriteLine($"Result is: {result}");
                return;
            }

            var newOperand = InputOperand();
            var attachResult = root.AttachOperand(newOperand);
            if (!attachResult)
            {
                throw new InvalidOperationException("Operation to attach new operand not found!");
            }
        }
    }

    private static BaseOperand InputOperand()
    {
        while (true)
        {
            var @string = Console.ReadLine()?.Trim();
            if (string.IsNullOrWhiteSpace(@string))
            {
                Console.WriteLine("Wrong input, try again.");
                continue;
            }

            foreach (var operandConstructor in OperandConstructors)
            {
                var operand = operandConstructor(@string);
                if (operand is not null)
                    return operand;
            }

            Console.WriteLine("Wrong input, try again.");
        }
    }
}