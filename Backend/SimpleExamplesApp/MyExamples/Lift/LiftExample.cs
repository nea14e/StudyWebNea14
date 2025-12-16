namespace SimpleExamplesApp.MyExamples.Lift;

public static class LiftExample
{
    public static void Run()
    {
        var lift = new Lift(
            [
                new Floor(
                    1,
                    new LinkedList<Person>(new List<Person> { new(2), new(3) })
                ),
                new Floor(
                    2,
                    new LinkedList<Person>(new List<Person> { new(1), new(3) })
                ),
                new Floor(
                    3,
                    new LinkedList<Person>(new List<Person> { new(1), new(1) })
                )
            ],
            initialFloor: 1
        );
        Console.WriteLine(lift.PrintState());
    }
}