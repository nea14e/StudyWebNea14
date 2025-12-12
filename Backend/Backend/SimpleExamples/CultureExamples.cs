using System.Globalization;

namespace Backend.SimpleExamples;

public static class CultureExamples
{
    public static void Run()
    {
        var dateTime = new DateTime(2025, 12, 31, 23, 59, 59, 999);

        Console.WriteLine(string.Format(
            new NumberFormatInfo { NumberDecimalSeparator = "|" },
            "String.Format: day: {0:dd.MM.yyyy} time: {0:HH:mm:ss}.{1}",
            dateTime,
            dateTime.Millisecond
        ));

        var number = double.Parse(
            "12340|56789",
            new NumberFormatInfo { NumberDecimalSeparator = "|" }
        );
        number *= 100;
        Console.WriteLine($"double number: {number:#,##0.00}");
    }
}