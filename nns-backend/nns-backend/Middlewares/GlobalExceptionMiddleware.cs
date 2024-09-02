using System.Net;
using System.Text.Json;

namespace nns_backend.Middlewares
{
    public class GlobalExceptionMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                // todo push notification & writing log
                Console.WriteLine("GobalExceptionMiddleware");
                Console.WriteLine(ex.Message);
                var response = new
                {
                    status = HttpStatusCode.BadRequest,
                    message = ex.Message
                };

                var jsonResponse = JsonSerializer.Serialize(response);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await context.Response.WriteAsync(jsonResponse);
            }
        }
    }
}
