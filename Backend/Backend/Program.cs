using Backend.Entities;
using Backend.IServices;
using Backend.IServices.DbTaskRunner;
using Backend.Other;
using Backend.Services;
using Backend.Services.DbTaskRunner;
using Backend.SimpleExamples;

// При сравнении record'ов учитываются все поля, в т.ч. private
RecordExamples.ComparePrivateFields();

// При сравнении кортежей учитывается порядок элементов и не учитываются названия
TupleExamples.CompareDifferentStructureTuples();
TupleExamples.PassingByValue();

var builder = WebApplication.CreateBuilder(args);

const string frontendCors = "frontendCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: frontendCors,
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});

builder.Services
    .AddTransient<IWeatherForecastService, WeatherForecastService>()
    .AddTransient<IRequestErrorsExampleService, RequestErrorsExampleService>()
    .AddTransient<ISimpleRequest2Service, SimpleRequest2Service>()
    .AddTransient<IRequestWithParametersService, RequestWithParametersService>()
    .AddSingleton<ICrudExampleService, CrudExampleService>()
    .AddSingleton<IJsonConstructorService, JsonConstructorService>()
    .AddTransient<BackendDbContext>()
    .AddSingleton<IDbTaskRunnerService, DbTaskRunnerService>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers(mvcOptions => { mvcOptions.InputFormatters.Add(new PlainTextFormatter()); });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(frontendCors);
app.UseHttpsRedirection();
app.MapControllers();

app.Run();