using Backend.Dtos;

namespace Backend.IServices;

public interface IRequestWithParametersService
{
    string Plus(int a, int b);

    List<RequestWithComplexParametersListItemDto> GetComplexParametersList(
        RequestWithComplexParametersFilterDto? filter);

    PostRequestResponseBody PostRequest(PostRequestRequestBody requestBody);
}