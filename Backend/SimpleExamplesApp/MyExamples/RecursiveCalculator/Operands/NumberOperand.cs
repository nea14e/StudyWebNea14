using System.Globalization;
using System.Text.RegularExpressions;

namespace SimpleExamplesApp.MyExamples.RecursiveCalculator.Operands;

public class NumberOperand : BaseOperand
{
    private static readonly Regex CheckInputRegex = new(@"^-?\d+(\.\d+)?$");

    private double Value { get; }

    private NumberOperand(double value)
    {
        Value = value;
    }

    public static NumberOperand? TryConstruct(string input)
    {
        if (!CheckInputRegex.IsMatch(input))
            return null;
        if (!double.TryParse(input, CultureInfo.InvariantCulture, out var value))
            return null;
        return new NumberOperand(value);
    }

    public override string Print(ref bool wasUnfilledFound, out bool hasUnfilled)
    {
        hasUnfilled = false;
        return Value.ToString(CultureInfo.InvariantCulture);
    }

    public override bool AttachOperand(BaseOperand newOperand)
    {
        return false;
    }

    public override double Calculate()
    {
        return Value;
    }
}