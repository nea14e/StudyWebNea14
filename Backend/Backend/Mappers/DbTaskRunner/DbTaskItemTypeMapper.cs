using Backend.LogicEntities.DbTaskRunner;

namespace Backend.Mappers.DbTaskRunner;

public static class DbTaskItemTypeMapper
{
    public static DbTaskItemTypeLe EntityToLe(string entityValue)
    {
        if (!Enum.TryParse<DbTaskItemTypeLe>(entityValue, out var result))
            throw new ArgumentOutOfRangeException(nameof(entityValue), entityValue,
                "Неправильное значение типа задачи.");
        return result;
    }
}