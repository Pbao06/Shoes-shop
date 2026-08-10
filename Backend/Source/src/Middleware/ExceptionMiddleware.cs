using System.Net;
using System.Text.Json;

namespace src.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ex switch
            {
                FatherError error => error.StatusCode,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var response = new
            {
                success = false,
                message = ex.Message,
                statusCode = context.Response.StatusCode
            };

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}
