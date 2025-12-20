namespace SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

public record BaseTask
{
    public decimal? Result;

    public override string ToString()
    {
        throw new NotImplementedException();
    }
}