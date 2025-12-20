namespace SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

public record DivideTask(decimal First, decimal Second) : BaseTask
{
    public override string ToString()
    {
        return $"{First} / {Second} = {Result}";
    }
}