namespace Backend.LogicEntities.DbTaskRunner;

public enum DbTaskItemTypeLe
{
    BeginTransaction,
    Table,
    Scalar,
    NonQuery,
    CommitTransaction,
    RollbackTransaction
}