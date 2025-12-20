using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver.Solvers;

public class DivideSolver : BaseSolver<DivideTask>
{
    public override decimal Solve(DivideTask task)
    {
        if (task.Second == 0)
        {
            throw new InvalidDataException("DivideTask.Second must not be 0");
        }

        return task.First / task.Second;
    }
}