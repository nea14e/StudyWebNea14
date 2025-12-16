using System.Text;

namespace SimpleExamplesApp.MyExamples.Lift;

public class Lift(List<Floor> floors, int initialFloor)
{
    private int _currentFloorNumber = initialFloor;
    private Direction _currentDirection = Direction.Up;
    private List<Person> _innerPeople = [];

    public void ProceedTick()
    {
    }

    public string PrintState()
    {
        var sb = new StringBuilder();
        sb.AppendLine("========================================================");
        foreach (var floor in floors.OrderByDescending(f => f.FloorNumber))
        {
            sb.Append("|")
                .Append(floor.FloorNumber == _currentFloorNumber ? "L" : " ")
                .Append(floor.FloorNumber == _currentFloorNumber
                    ? _currentDirection == Direction.Up ? "^" : "v"
                    : " ")
                .Append("|");
            sb.Append(floor.PrintState());
            sb.AppendLine();
        }

        sb.AppendLine("========================================================");
        sb.AppendLine();
        return sb.ToString();
    }
}