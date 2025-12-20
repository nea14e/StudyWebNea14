namespace SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

public record SquareRootTask(decimal X) : BaseTask
{
    public override string ToString()
    {
        return $"Sqrt{{{X}}} = {Result}";
    }
}