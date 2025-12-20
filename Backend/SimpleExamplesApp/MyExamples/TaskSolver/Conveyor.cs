using SimpleExamplesApp.MyExamples.TaskSolver.Solvers;
using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver;

public class Conveyor
{
    public List<BaseTask> ProcessList(List<BaseTask> tasks)
    {
        var plusSolver = new PlusSolver();
        var divideSolver = new DivideSolver();
        var squareRootSolver = new SquareRootSolver();
        foreach (var task in tasks)
        {
            var result = task switch
            {
                PlusTask plusTask => plusSolver.Solve(plusTask),
                DivideTask divideTask => divideSolver.Solve(divideTask),
                SquareRootTask squareRootTask => squareRootSolver.Solve(squareRootTask),
                _ => throw new InvalidOperationException($"{task.GetType()} is not supported!")
            };
            task.Result = result;
        }

        return tasks;
    }
}