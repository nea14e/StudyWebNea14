using Backend.Entities;

namespace Backend.LogicEntities.DbTaskRunner;

public class DbTaskProcessLe
{
    public Guid Id { get; set; }

    public int ProcessNumber { get; set; }

    public bool IsDeleted { get; set; }

    public List<DbTaskItemLe> TaskItems { get; set; }

    public BackendDbContext? DbContext { get; set; }

    public DbTaskItemLe? RunningTaskItem { get; set; }
    public Task? RunningTask { get; set; }
}