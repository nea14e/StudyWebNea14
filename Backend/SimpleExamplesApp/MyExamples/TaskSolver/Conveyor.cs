namespace SimpleExamplesApp.MyExamples.TaskSolver;

public class Conveyor
{
    public List<decimal> ProcessList(List<Task> tasks)
    {
        var resultsList = new List<decimal>();
        var taskSolver = new TaskSolver();
        foreach (var task in tasks)
        {
            var result = taskSolver.Solve(task);
            resultsList.Add(result);
        }

        return resultsList;
    }
}