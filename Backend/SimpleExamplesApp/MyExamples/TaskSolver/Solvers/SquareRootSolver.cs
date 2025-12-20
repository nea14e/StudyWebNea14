using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver.Solvers;

public class SquareRootSolver : BaseSolver<SquareRootTask>
{
    public override decimal Solve(SquareRootTask task)
    {
        if (task.X < 0)
        {
            throw new InvalidDataException("SquareRootTask.X must be >= 0");
        }

        return (decimal)Math.Sqrt((double)task.X);
    }
}