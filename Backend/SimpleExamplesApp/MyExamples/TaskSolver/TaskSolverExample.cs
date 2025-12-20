namespace SimpleExamplesApp.MyExamples.TaskSolver;

public static class TaskSolverExample
{
    public static void Run()
    {
        var taskSolver = new TaskSolver();
        var task = new Task(3, 1);
        var result = taskSolver.Solve(task);
        Console.WriteLine($"TaskSolverExample: result = {result}");
    }
}