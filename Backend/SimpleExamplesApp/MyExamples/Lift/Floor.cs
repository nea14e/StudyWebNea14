using System.Text;

namespace SimpleExamplesApp.MyExamples.Lift;

public class Floor
{
    public readonly int FloorNumber;

    private readonly LinkedList<Person> _peopleQueue;

    public Floor(int floorNumber, LinkedList<Person> peopleQueue)
    {
        FloorNumber = floorNumber;
        _peopleQueue = peopleQueue;
    }

    public bool HasPeople(Direction direction) =>
        _peopleQueue.Any(p =>
            direction == Direction.Up
                ? p.TargetFloor > FloorNumber
                : p.TargetFloor < FloorNumber
        );

    public LinkedList<Person> GetPeople(Direction direction, int maxCount)
    {
        var resultPeople = new LinkedList<Person>();
        foreach (var person in _peopleQueue)
        {
            if ((direction == Direction.Up && person.TargetFloor > FloorNumber) ||
                (direction == Direction.Down && person.TargetFloor < FloorNumber))
            {
                resultPeople.AddLast(person);
                _peopleQueue.Remove(person);
                if (resultPeople.Count == maxCount)
                {
                    return resultPeople;
                }
            }
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