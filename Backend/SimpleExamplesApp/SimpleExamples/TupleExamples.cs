namespace SimpleExamplesApp.SimpleExamples;

public static class TupleExamples
{
    public static void CompareDifferentStructureTuples()
    {
        var tuple1 = (a: 5, b: 10);
        var tuple2 = (b: 5, a: 10); // Названия полей не имеют значения, а только порядок
        Console.WriteLine("tuple1: " + tuple1);
        Console.WriteLine("tuple2: " + tuple2);
        Console.WriteLine("tuple1 == tuple2: " +
                          (tuple1 ==
                           tuple2)); // При сравнении кортежей учитывается порядок элементов и не учитываются названия
    }

    public static void PassingByValue()
    {
        var tuple1 = (a: 5, b: 10);

        // ReSharper disable once MoveLocalFunctionAfterJumpStatement
        (int a3, double b3) DoubleB((int a, int b) tuple)
        {
            tuple.b = 2 * tuple.b; // Снаружи функции кортеж не изменится
            (int a2, float b2) tuple2 = tuple; // Названия полей не имеют значения, а только порядок
            return tuple2;
        }

        Console.WriteLine("tuple1 before doubleB(): " + tuple1);
        Console.WriteLine("doubleB() result: " + DoubleB(tuple1));
        Console.WriteLine("tuple1 after doubleB(): " + tuple1);
    }
}