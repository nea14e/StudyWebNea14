namespace SimpleExamplesApp.SimpleExamples;

public static class PatternMatchingExamples
{
    public static void Run()
    {
        var myObject = new MyClass
        {
            MyField = 5
        };
        Console.WriteLine(myObject is { MyField: >= 5 and <= 5 }
            ? "PatternMatchingExamples: if: MyField is equal to 5."
            : "PatternMatchingExamples: if: MyField has other value.");

        switch (myObject)
        {
            case { MyField: >= 5 and <= 5 }:
                Console.WriteLine("PatternMatchingExamples: switch: MyField is equal to 5.");
                break;
            default:
                Console.WriteLine("PatternMatchingExamples: switch: MyField has other value.");
                break;
        }
    }

    private class MyClass
    {
        public required int MyField;
    }
}