using nns_backend.Interfaces;

namespace nns_backend.Workers
{
    public class CronJobService
    {
        private Timer _timer;
        private readonly IServiceProvider _serviceProvider;
        private readonly ICurrentTime _currentTime;
        private readonly IAgentProductPreferenceRepository _repository;
        private readonly ILogger<CronJobService> _logger;

        public CronJobService(IServiceProvider serviceProvider, ICurrentTime currentTime, IAgentProductPreferenceRepository repository)
        {
            _serviceProvider = serviceProvider;
            _currentTime = currentTime;
            _repository = repository;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // Calculate the initial delay until the next 8 AM.
            var now = _currentTime.GetCurrentTime().Date;
            var nextRunTime = _currentTime.GetCurrentTime().Date.AddHours(8);
            if (now > nextRunTime)
            {
                nextRunTime = nextRunTime.AddDays(1);
            }

            var initialDelay = nextRunTime - now;

            // Set up the timer to run the method daily at 8 AM.
            _timer = new Timer(DoWork, null, initialDelay, TimeSpan.FromHours(24));

            return Task.CompletedTask;
        }

        private async void DoWork(object state)
        {
            using (var scope = _serviceProvider.CreateScope())
            {

                await _repository.TransferTodayPricesToProductTypePricesAsync(_currentTime.GetCurrentTime());
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
