namespace SimpleExamplesApp.MyExamples.RecursiveCalculator.Operands;

public class Operation : BaseOperand
{
    private static readonly Dictionary<string, Func<double, double, double>> Operations = new()
    {
        ["+"] = (x, y) => x + y,
        ["-"] = (x, y) => x - y,
        ["*"] = (x, y) => x * y,
        ["/"] = (x, y) => x / y
    };

    private string OperationSign { get; }
    private Func<double, double, double> OperationFunc { get; }

    private BaseOperand? FirstOperand { get; set; }

    private BaseOperand? SecondOperand { get; set; }

    private Operation(string operationSign, Func<double, double, double> operationFunc)
    {
        OperationSign = operationSign;
        OperationFunc = operationFunc;
        FirstOperand = null;
        SecondOperand = null;
    }

    public static Operation? TryConstruct(string input)
    {
        var operationSign = input;
        if (!Operations.TryGetValue(operationSign, out var operationFunc))
            return null;
        var operation = new Operation(operationSign, operationFunc);
        return operation;
    }

    public override string Print(ref bool wasUnfilledFound, out bool hasUnfilled)
    {
        string firstOperandString;
        bool hasUnfilledInFirst;
        if (FirstOperand is null)
        {
            hasUnfilledInFirst = true;
            if (wasUnfilledFound)
            {
                firstOperandString = "_";
            }
            else
            {
                wasUnfilledFound = true;
                firstOperandString = "?";
            }
        }
        else
        {
            firstOperandString = FirstOperand.Print(ref wasUnfilledFound, out hasUnfilledInFirst);
        }

        string secondOperandString;
        bool hasUnfilledInSecond;
        if (SecondOperand is null)
        {
            hasUnfilledInSecond = true;
            if (wasUnfilledFound)
            {
                secondOperandString = "_";
            }
            else
            {
                wasUnfilledFound = true;
                secondOperandString = "?";
            }
        }
        else
        {
            secondOperandString = SecondOperand.Print(ref wasUnfilledFound, out hasUnfilledInSecond);
        }

        hasUnfilled = FirstOperand is null || hasUnfilledInFirst || SecondOperand is null || hasUnfilledInSecond;
        return $"({firstOperandString} {OperationSign} {secondOperandString})";
    }

    public override bool AttachOperand(BaseOperand newOperand)
    {
        if (FirstOperand is null)
        {
            FirstOperand = newOperand;
            return true;
        }

        var isAttachedToFirstOperand = FirstOperand.AttachOperand(newOperand);
        if (isAttachedToFirstOperand)
        {
            return true;
        }

        if (SecondOperand is null)
        {
            SecondOperand = newOperand;
            return true;
        }

        var isAttachedToSecondOperand = SecondOperand.AttachOperand(newOperand);
        if (isAttachedToSecondOperand)
        {
            return true;
        }

        return false;
    }

    public override double Calculate()
    {
        if (FirstOperand is null || SecondOperand is null)
        {
            throw new InvalidOperationException("Not all operands has been filled yet!");
        }

        var firstOperandValue = FirstOperand.Calculate();
        var secondOperandValue = SecondOperand.Calculate();
        var result = OperationFunc(firstOperandValue, secondOperandValue);
        return result;
    }
}