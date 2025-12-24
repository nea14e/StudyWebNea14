using SimpleExamplesApp.MyExamples.TaskSolver.Solvers;
using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver;

public class SolverFactory
{
    private readonly Dictionary<Type, object> _solvers = new()
    {
        [typeof(PlusTask)] = new PlusSolver(),
        [typeof(DivideTask)] = new DivideSolver(),
        [typeof(SquareRootTask)] = new SquareRootSolver()
    };

    public BaseSolver<TTask> GetSolver<TTask>()
        where TTask : BaseTask
    {
        if (!_solvers.TryGetValue(typeof(TTask), out var solver))
            throw new InvalidOperationException($"{typeof(TTask)} is not supported!");
        return (BaseSolver<TTask>)solver;
    }
}