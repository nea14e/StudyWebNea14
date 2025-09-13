using Backend.Dtos.DbTaskRunner;

namespace Backend.IServices.DbTaskRunner;

public interface IDbTaskRunnerService
{
    Task LoadExample(Guid instanceId, string exampleKey);

    List<List<DbTaskItemDto>> GetProgress(Guid instanceId);
}