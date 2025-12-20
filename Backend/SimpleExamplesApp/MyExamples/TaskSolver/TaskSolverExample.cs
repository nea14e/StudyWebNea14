using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver;

public static class TaskSolverExample
{
    public static void Run()
    {
        var tasks = new List<BaseTask>
        {
            new PlusTask(3, 1),
            new PlusTask(100, 1),
            new DivideTask(10, 2),
            new SquareRootTask(100)
        };
        var conveyor = new Conveyor();
        var results = conveyor.ProcessList(tasks);

        foreach (var result in results)
        {
            Console.WriteLine($"TaskSolverExample: result = {result}");
        }
    }
}