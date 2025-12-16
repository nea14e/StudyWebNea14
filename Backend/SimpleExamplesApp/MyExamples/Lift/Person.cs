namespace SimpleExamplesApp.MyExamples.Lift;

public record Person(int TargetFloor)
{
    public string Print() => $"{TargetFloor}";
}