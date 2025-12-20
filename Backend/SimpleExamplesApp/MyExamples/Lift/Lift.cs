using System.Text;

namespace SimpleExamplesApp.MyExamples.Lift;

public class Lift(int maxCapacity, List<Floor> floors, int initialFloor)
{
    private int _currentFloorNumber = initialFloor;
    private Direction _currentDirection = Direction.Up;
    private List<Person> _innerPeople = [];
    private bool _isStoppedOnCurrentFloor = false;

    public bool ProceedTick(bool isFirstTick)
    {
        if (!isFirstTick)
            _move();
        _proceedStop();
        return _hasPendingWork();
    }

    private void _move()
    {
        if (_currentDirection == Direction.Up)
        {
            if (_innerPeople.Any(p => p.TargetFloor > _currentFloorNumber))
            {
                _currentDirection = Direction.Up;
            }
            else if (_innerPeople.Any(p => p.TargetFloor < _currentFloorNumber))
            {
                _currentDirection = Direction.Down;
            }
            else if (floors.Any(f => f.HasPeople(null) && f.FloorNumber > _currentFloorNumber))
            {
                _currentDirection = Direction.Up;
            }
            else if (floors.Any(f => f.HasPeople(null) && f.FloorNumber < _currentFloorNumber))
            {
                _currentDirection = Direction.Down;
            }
            else
            {
                throw new InvalidOperationException("Do NOT call ProceedTick() if previous one returned false!");
            }
        }
        else
        {
            if (_innerPeople.Any(p => p.TargetFloor < _currentFloorNumber))
            {
                _currentDirection = Direction.Down;
            }
            else if (_innerPeople.Any(p => p.TargetFloor > _currentFloorNumber))
            {
                _currentDirection = Direction.Up;
            }
            else if (floors.Any(f => f.HasPeople(null) && f.FloorNumber < _currentFloorNumber))
            {
                _currentDirection = Direction.Down;
            }
            else if (floors.Any(f => f.HasPeople(null) && f.FloorNumber > _currentFloorNumber))
            {
                _currentDirection = Direction.Up;
            }
            else
            {
                throw new InvalidOperationException("Do NOT call ProceedTick() if previous one returned false!");
            }
        }

        _currentFloorNumber += (int)_currentDirection;

        if (floors.Any(f => f.FloorNumber == _currentFloorNumber) == false)
        {
            throw new InvalidDataException($"Floor does not exist: {_currentFloorNumber}");
        }
    }

    private void _proceedStop()
    {
        _isStoppedOnCurrentFloor = false;
        var currentFloor = floors.First(f => f.FloorNumber == _currentFloorNumber);

        var personsToOut = _innerPeople.Where(p => p.TargetFloor == _currentFloorNumber).ToList();
        if (personsToOut.Any())
        {
            _isStoppedOnCurrentFloor = true;
            foreach (var person in personsToOut)
            {
                _innerPeople.Remove(person);
            }
        }

        var personsToEnter = currentFloor.GetPeople(_currentDirection, maxCapacity - _innerPeople.Count);
        if (personsToEnter.Any())
        {
            _isStoppedOnCurrentFloor = true;
            _innerPeople.AddRange(personsToEnter);
        }
    }

    private bool _hasPendingWork()
    {
        return _innerPeople.Any() || floors.Any(f => f.HasPeople(null));
    }

    public string PrintState()
    {
        var sb = new StringBuilder();
        sb.AppendLine("========================================================");
        foreach (var floor in floors.OrderByDescending(f => f.FloorNumber))
        {
            sb.Append(floor.FloorNumber == _currentFloorNumber && _isStoppedOnCurrentFloor ? "_" : "|")
                .Append(floor.FloorNumber == _currentFloorNumber ? "L" : " ")
                .Append(floor.FloorNumber == _currentFloorNumber
                    ? _currentDirection == Direction.Up ? "^" : "v"
                    : " ")
                .Append(floor.FloorNumber == _currentFloorNumber && _isStoppedOnCurrentFloor ? "_" : "|");
            sb.Append(floor.PrintState());
            sb.AppendLine();
        }

        sb.AppendLine("--------------------------------------------------------");
        sb.AppendLine("Lift: " + string.Join(" ", _innerPeople.Select(p => p.Print())));
        sb.AppendLine("========================================================");
        sb.AppendLine();
        return sb.ToString();
    }
}