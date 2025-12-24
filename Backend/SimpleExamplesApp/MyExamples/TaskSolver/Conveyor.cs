using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver;

public class Conveyor
{
    public List<BaseTask> ProcessList(List<BaseTask> tasks)
    {
        var solverFactory = new SolverFactory();
        foreach (var task in tasks)
        {
            decimal result;
            switch (task)
            {
                case PlusTask plusTask:
                {
                    var solver = solverFactory.GetSolver<PlusTask>();
                    result = solver.Solve(plusTask);
                    break;
                }
                case DivideTask divideTask:
                {
                    var solver = solverFactory.GetSolver<DivideTask>();
                    result = solver.Solve(divideTask);
                    break;
                }
                case SquareRootTask squareRootTask:
                {
                    var solver = solverFactory.GetSolver<SquareRootTask>();
                    result = solver.Solve(squareRootTask);
                    break;
                }
                default:
                    throw new NotImplementedException($"Solver for task {task.GetType().Name} is not implemented");
            }

            task.Result = result;
        }

        return tasks;
    }
}