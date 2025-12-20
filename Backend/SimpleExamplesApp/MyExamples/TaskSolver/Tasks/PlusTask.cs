namespace SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

public record PlusTask(decimal First, decimal Second) : BaseTask
{
    public override string ToString()
    {
        return $"{First} + {Second} = {Result}";
    }
}