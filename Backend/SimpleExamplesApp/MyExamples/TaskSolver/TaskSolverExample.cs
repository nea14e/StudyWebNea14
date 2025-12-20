namespace SimpleExamplesApp.MyExamples.TaskSolver;

public static class TaskSolverExample
{
    public static void Run()
    {
        var tasks = new List<Task>
        {
            new(3, 1),
            new(4, 1),
            new(100, 1)
        };
        var conveyor = new Conveyor();
        var results = conveyor.ProcessList(tasks);

        foreach (var result in results)
        {
            Console.WriteLine($"TaskSolverExample: result = {result}");
        }
    }
}