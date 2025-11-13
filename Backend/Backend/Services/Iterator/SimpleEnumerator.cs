using System.Collections;

namespace Backend.Services.Iterator;

public class SimpleEnumerator(int from, int to) : IEnumerator<int>
{
#pragma warning disable CS9124 // Parameter is captured into the state of the enclosing type and its value is also used to initialize a field, property, or event.
    private int _current = from;
#pragma warning restore CS9124 // Parameter is captured into the state of the enclosing type and its value is also used to initialize a field, property, or event.

    public bool MoveNext()
    {
        // ReSharper disable once InvertIf
        if (_current < to)
        {
            _current++;
            return true;
        }

        return false;
    }

    public int Current => _current <= to ? _current : throw new InvalidOperationException();
    object IEnumerator.Current => Current;

    public void Reset()
    {
        _current = from;
    }

    public void Dispose()
    {
    }
}