using Microsoft.EntityFrameworkCore;

namespace nns_backend.DI
{
    public static class MigrationExtensions
    {
        public static async Task ApplyMigrations(this IApplicationBuilder app, ILogger _logger)
        {
            try
            {
                using IServiceScope scope = app.ApplicationServices.CreateScope();

                using NNSDBContext dbContext =
                    scope.ServiceProvider.GetRequiredService<NNSDBContext>();

                await dbContext.Database.MigrateAsync();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "An problem occurred during migration!");
            }
        }
    }
}
