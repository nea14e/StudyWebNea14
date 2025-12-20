namespace SimpleExamplesApp.MyExamples.Lift;

public static class LiftExample
{
    public static void Run()
    {
        var lift = new Lift(
            3,
            [
                new Floor(
                    3,
                    [new Person(1), new Person(1), new Person(1)]
                ),
                new Floor(
                    2,
                    [new Person(1), new Person(1), new Person(3)]
                ),
                new Floor(
                    1,
                    [new Person(2), new Person(3)]
                )
            ],
            initialFloor: 1
        );

        var isFirstTick = true;
        while (true)
        {
            var willContinue = lift.ProceedTick(isFirstTick);
            isFirstTick = false;
            Console.WriteLine(lift.PrintState());
            if (!willContinue)
                break;
        }
    }
}