using Microsoft.AspNetCore.Mvc.Formatters;

namespace Backend.Other;

// Из https://makolyte.com/aspnetcore-how-to-receive-a-text-plain-request/
public class PlainTextFormatter : InputFormatter
{
    private const string TextPlain = "text/plain";

    public PlainTextFormatter()
    {
        SupportedMediaTypes.Add(TextPlain);
    }

    public override async Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context)
    {
        try
        {
            using var reader = new StreamReader(context.HttpContext.Request.Body);
            var plainTextBody = await reader.ReadToEndAsync();
            // Преобразуем в тип, который стоит у входного параметра метода в ApiController
            var model = Convert.ChangeType(plainTextBody, context.ModelType);
            return await InputFormatterResult.SuccessAsync(model);
        }
        catch (Exception ex)
        {
            context.ModelState.TryAddModelError("BodyTextValue", $"{ex.Message} ModelType={context.ModelType}");
            return await InputFormatterResult.FailureAsync();
        }
    }

    protected override bool CanReadType(Type type)
    {
        return type == typeof(string);
    }

    public override bool CanRead(InputFormatterContext context)
    {
        return context.HttpContext.Request.ContentType == TextPlain;
    }
}