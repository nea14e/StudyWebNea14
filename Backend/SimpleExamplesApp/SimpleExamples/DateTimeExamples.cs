namespace SimpleExamplesApp.SimpleExamples;

public static class DateTimeExamples
{
    public static void Run()
    {
        var dateTime = new DateTime(2025, 12, 31, 23, 59, 59);
        Console.WriteLine($"DateTime: {dateTime}");
        Console.WriteLine($"DateTime Local to UTC: {dateTime.ToUniversalTime()}");
        Console.WriteLine($"DateTime UTC to Local: {dateTime.ToLocalTime()}");
        Console.WriteLine($"DateTime Local to UTC to Local: {dateTime.ToUniversalTime().ToLocalTime()}");

        var timeSpan = TimeSpan.FromHours(1, 59);
        Console.WriteLine($"dateTime.Subtract(timeSpan): {dateTime.Subtract(timeSpan)}"); // Note: typo in "Subtract"!!!
        Console.WriteLine($"dateTime.Add(timeSpan): {dateTime.Add(timeSpan)}");

        Console.WriteLine($"DateTime.Date: {dateTime.Date}");
        Console.WriteLine($"DateTime.TimeOfDay: {dateTime.TimeOfDay}");

        Console.WriteLine($"TimeSpan: {new TimeSpan(3, 23, 59, 59)}");
        Console.WriteLine($"DateOnly: {new DateOnly(2025, 12, 31)}");
        Console.WriteLine($"TimeOnly: {new TimeOnly(23, 59, 59, 999)}");

        var dateOnly = DateOnly.FromDateTime(dateTime);
        Console.WriteLine($"DateOnly.FromDateTime(dateTime): {dateOnly}");
        var timeOnly = TimeOnly.FromTimeSpan(dateTime.TimeOfDay);
        Console.WriteLine($"TimeOnly.FromTimeSpan(dateTime.TimeOfDay): {timeOnly}");

        var dateTime2 = dateOnly.ToDateTime(timeOnly);
        Console.WriteLine($"dateTime2: {dateTime2}");
    }
}