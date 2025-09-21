using Backend.Dtos.DbTaskRunner;

namespace Backend.IServices.DbTaskRunner;

public interface IDbTaskRunnerService
{
    Task LoadExample(Guid instanceId, string exampleKey);

    Task RunSnippet(Guid instanceId, string snippetKey);

    DbTaskExampleDto GetProgress(Guid instanceId);
}