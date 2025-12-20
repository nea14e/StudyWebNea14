using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver.Solvers;

public class PlusSolver : BaseSolver<PlusTask>
{
    public override decimal Solve(PlusTask task)
    {
        return task.First + task.Second;
    }
}