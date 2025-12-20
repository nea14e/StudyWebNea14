using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver.Solvers;

public abstract class BaseSolver<TTask>
    where TTask : BaseTask
{
    public abstract decimal Solve(TTask task);
}