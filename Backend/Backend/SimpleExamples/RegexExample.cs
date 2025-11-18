using System.Text.RegularExpressions;

namespace Backend.SimpleExamples;

public static class RegexExample
{
    private static readonly Regex GetNumbersRegex = new(@"{(?:(?:(?!})\D)+)?(?:(\d+)((?:(?!})\D)+))+}");

    public static void RunRegex(string input)
    {
        Console.WriteLine($"RunRegex(): input: {input}");
        var matches = GetNumbersRegex.Matches(input);
        foreach (Match match in matches)
        {
            Console.WriteLine($"RunRegex(): match: {match.Value}");
            foreach (Group group in match.Groups)
            {
                Console.WriteLine($"RunRegex(): group: {group.Value}");
                foreach (Capture capture in group.Captures)
                {
                    Console.WriteLine($"{capture.Value}");
                }
            }
        }
    }
}