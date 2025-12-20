using SimpleExamplesApp.MyExamples.TaskSolver.Tasks;

namespace SimpleExamplesApp.MyExamples.TaskSolver;

public static class ResultPrinter
{
    public static void PrintResults(List<BaseTask> results)
    {
        foreach (var result in results)
        {
            Console.WriteLine(result);
        }
    }
}