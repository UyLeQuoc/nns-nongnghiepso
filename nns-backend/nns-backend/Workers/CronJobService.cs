using nns_backend.Interfaces;

namespace nns_backend.Workers
{
    public class CronJobService : IHostedService, IDisposable
    {
        private Timer _timer;
        private readonly IServiceProvider _serviceProvider;
        private readonly ICurrentTime _currentTime;
        private readonly IAgentProductPreferenceRepository _repository;
        private readonly ILogger<CronJobService> _logger;

        public CronJobService(
            IServiceProvider serviceProvider,
            ICurrentTime currentTime,
            IAgentProductPreferenceRepository repository,
            ILogger<CronJobService> logger)
        {
            _serviceProvider = serviceProvider;
            _currentTime = currentTime;
            _repository = repository;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("CronJobService is starting...");

            // Get current time in UTC +7
            var now = _currentTime.GetCurrentTime();
            var nextRunTime = now.Date.AddHours(8); // 8 AM local time (UTC +7)
            _logger.LogInformation($"Current time is {now}. Next run time is set for {nextRunTime}.");

            if (now > nextRunTime)
            {
                nextRunTime = nextRunTime.AddDays(1); // If past 8 AM, schedule for the next day
                _logger.LogInformation($"Next run time adjusted to {nextRunTime}.");
            }

            var initialDelay = nextRunTime - now;
            _logger.LogInformation($"Initial delay is {initialDelay.TotalMinutes} minutes.");

            // Set up the timer to run the method daily at 8 AM.
            _timer = new Timer(DoWork, null, initialDelay, TimeSpan.FromHours(24));
            _logger.LogInformation("Timer is set to trigger every 24 hours.");

            return Task.CompletedTask;
        }

        private async void DoWork(object state)
        {
            _logger.LogInformation("CronJobService is executing DoWork at {Time}.", _currentTime.GetCurrentTime());

            using (var scope = _serviceProvider.CreateScope())
            {
                try
                {
                    _logger.LogInformation("Transferring today's prices to ProductTypePrices...");
                    await _repository.TransferTodayPricesToProductTypePricesAsync(_currentTime.GetCurrentTime());
                    _logger.LogInformation("Successfully transferred today's prices.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred during the execution of DoWork.");
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("CronJobService is stopping...");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _logger.LogInformation("CronJobService is disposing...");
            _timer?.Dispose();
        }
    }
}
