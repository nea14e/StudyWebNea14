using Backend.Dtos;
using Backend.Entities;
using Backend.IServices;
using Backend.IServices.DbTaskRunner;
using Backend.Other;
using Backend.Services;
using Backend.Services.DbTaskRunner;

var obj1 = new TestRecord(Guid.Empty, "First");
Console.WriteLine(obj1);
var obj2 = new TestRecord(Guid.Empty, "First");
Console.WriteLine(obj2);
Console.WriteLine(obj1 == obj2); // Объекты имеют разное значение private-поля

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