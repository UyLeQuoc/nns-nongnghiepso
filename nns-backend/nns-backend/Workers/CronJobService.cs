using nns_backend.Interfaces;

namespace nns_backend.Workers
{
    public class CronJobService : IHostedService, IDisposable
    {
        private Timer _dailyTimer;
        private Timer _hourlyLogTimer;
        private readonly IServiceProvider _serviceProvider; // IServiceProvider will be used to create scopes
        private readonly ILogger<CronJobService> _logger;
        private DateTime _nextRunTime;

        public CronJobService(
            IServiceProvider serviceProvider,
            ILogger<CronJobService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("CronJobService is starting...");

            using (var scope = _serviceProvider.CreateScope())
            {
                var currentTimeService = scope.ServiceProvider.GetRequiredService<ICurrentTime>();
                var now = currentTimeService.GetCurrentTime();
                _nextRunTime = now.Date.AddHours(8); // 8 AM local time (UTC +7)
                _logger.LogInformation($"Current time is {now}. Next run time is set for {_nextRunTime}.");

                if (now > _nextRunTime)
                {
                    _nextRunTime = _nextRunTime.AddDays(1); // If past 8 AM, schedule for the next day
                    _logger.LogInformation($"Next run time adjusted to {_nextRunTime}.");
                }

                var initialDelay = _nextRunTime - now;
                _logger.LogInformation($"Initial delay is {initialDelay.TotalMinutes} minutes.");

                // Set up the daily timer to run the job at 8 AM every day.
                _dailyTimer = new Timer(DoWork, null, initialDelay, TimeSpan.FromHours(24));

                // Set up an hourly timer to log the remaining time every hour.
                _hourlyLogTimer = new Timer(LogTimeRemaining, null, TimeSpan.Zero, TimeSpan.FromHours(1));
            }

            return Task.CompletedTask;
        }

        private async void DoWork(object state)
        {
            _logger.LogInformation("CronJobService is executing DoWork at {Time}.", DateTime.UtcNow.AddHours(7));

            using (var scope = _serviceProvider.CreateScope())
            {
                var currentTimeService = scope.ServiceProvider.GetRequiredService<ICurrentTime>();
                var repository = scope.ServiceProvider.GetRequiredService<IAgentProductPreferenceRepository>();
                var now = currentTimeService.GetCurrentTime();

                try
                {
                    _logger.LogInformation("Transferring today's prices to ProductTypePrices...");
                    await repository.TransferTodayPricesToProductTypePricesAsync(now);
                    _logger.LogInformation("Successfully transferred today's prices.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during the execution of DoWork.");
                }
            }
        }

        // Logs the remaining time until the next job run.
        private void LogTimeRemaining(object state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var currentTimeService = scope.ServiceProvider.GetRequiredService<ICurrentTime>();
                var now = currentTimeService.GetCurrentTime();
                var timeRemaining = _nextRunTime - now;

                if (timeRemaining.TotalMinutes <= 0)
                {
                    _logger.LogInformation("The job is scheduled to run soon.");
                }
                else
                {
                    _logger.LogInformation($"Time remaining until the next job: {timeRemaining.Hours} hours and {timeRemaining.Minutes} minutes.");
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("CronJobService is stopping...");
            _dailyTimer?.Change(Timeout.Infinite, 0);
            _hourlyLogTimer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _logger.LogInformation("CronJobService is disposing...");
            _dailyTimer?.Dispose();
            _hourlyLogTimer?.Dispose();
        }
    }
}
