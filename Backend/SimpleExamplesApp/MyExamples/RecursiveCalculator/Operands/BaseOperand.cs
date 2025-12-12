namespace SimpleExamplesApp.MyExamples.RecursiveCalculator.Operands;

public abstract class BaseOperand
{
    public abstract string Print(ref bool wasUnfilledFound, out bool hasUnfilled);

    public abstract bool AttachOperand(BaseOperand newOperand);

    public abstract double Calculate();
}