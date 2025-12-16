// See https://aka.ms/new-console-template for more information

using SimpleExamplesApp.MyExamples.Lift;
using SimpleExamplesApp.SimpleExamples;

Console.WriteLine("Hello, World!");

// При сравнении record'ов учитываются все поля, в т.ч. private
RecordExamples.ComparePrivateFields();

// При сравнении кортежей учитывается порядок элементов и не учитываются названия
TupleExamples.CompareDifferentStructureTuples();
TupleExamples.PassingByValue();

// Linq
LinqExamples.MethodsJoinExample();
LinqExamples.LeftJoinExample();
LinqExamples.ZipExample();

// Delegates
DelegateExamples.DelegateExample();
DelegateExamples.FuncAsDelegateExample();
DelegateExamples.EventExample();

// Regex
RegexExample.RunRegex("a {123bc234de345f}bcd{1bc2de3fgh}");

// CultureExamples
CultureExamples.Run();

// DateTimeExamples
DateTimeExamples.Run();

// RecursiveCalculator
// RecursiveCalculator.Run();

// Lift
LiftExample.Run();