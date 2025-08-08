using Backend.IServices;
using Backend.Services;

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
    .AddSingleton<ICrudExampleService, CrudExampleService>();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

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