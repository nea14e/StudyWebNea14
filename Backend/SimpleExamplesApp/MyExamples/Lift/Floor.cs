using System.Text;

namespace SimpleExamplesApp.MyExamples.Lift;

public class Floor
{
    public readonly int FloorNumber;

    private readonly List<Person> _peopleQueue;

    public Floor(int floorNumber, List<Person> peopleQueue)
    {
        FloorNumber = floorNumber;
        _peopleQueue = peopleQueue;
    }

    public bool HasPeople(Direction? direction)
    {
        if (direction == Direction.Up)
            return _peopleQueue.Any(p => p.TargetFloor > FloorNumber);
        if (direction == Direction.Down)
            return _peopleQueue.Any(p => p.TargetFloor < FloorNumber);
        return _peopleQueue.Any();
    }

    public List<Person> GetPeople(Direction direction, int maxCount)
    {
        var resultPeople = _peopleQueue
            .Where(p => direction == Direction.Up
                ? p.TargetFloor > FloorNumber
                : p.TargetFloor < FloorNumber
            )
            .Take(maxCount)
            .ToList();
        foreach (var person in resultPeople)
        {
            _peopleQueue.Remove(person);
        }

        return resultPeople;
    }

    public string PrintState()
    {
        var sb = new StringBuilder();
        sb.Append(FloorNumber)
            .Append("|")
            .Append(HasPeople(Direction.Up) ? "^" : " ")
            .Append(HasPeople(Direction.Down) ? "v" : " ")
            .Append(" ");

        sb.Append(string.Join(" ", _peopleQueue.Select(p => p.Print())));
        return sb.ToString();
    }
}