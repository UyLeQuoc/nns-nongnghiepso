using Microsoft.EntityFrameworkCore;
using nns_backend.DTO;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Repositories
{
    public class AgentProductPreferenceRepository : IAgentProductPreferenceRepository
    {
        private readonly NNSDBContext _context;
        private readonly ICurrentTime _currentTime;

        public AgentProductPreferenceRepository(NNSDBContext context, ICurrentTime currentTime)
        {
            _context = context;
            _currentTime = currentTime;
        }

        public async Task TransferTodayPricesToProductTypePricesAsync(DateTime priceUpdateDTO)
        {
            var preferencesWithPrices = await _context.AgentProductPreferences
                .ToListAsync();

            foreach (var preference in preferencesWithPrices)
            {
                // Create a new ProductTypePrice entry for each valid row
                var productTypePrice = new ProductTypePrice
                {
                    ProductTypeId = preference.ProductTypeId,
                    UserId = preference.UserId,
                    Price = preference.TodayPrice,
                    Note = preference.TodayPrice == 0 ? "Giá chưa cập nhật" : "",
                    CreatedAt = priceUpdateDTO, // Set the provided date
                    ModifiedAt = _currentTime.GetCurrentTime()
                };

                _context.ProductTypePrices.Add(productTypePrice);

                preference.TodayPrice = 0;
                preference.UpdatedAt = DateTime.UtcNow;
                _context.AgentProductPreferences.Update(preference);
            }

            // Save all changes to the database
            await _context.SaveChangesAsync();
        }

        public async Task<List<DailyAveragePriceDTO>> GetDailyAveragePriceAsync(int productTypeId)
        {
            // Query the ProductTypePrices table, group by date, and calculate the average price
            return await _context.ProductTypePrices
                .Where(p => p.ProductTypeId == productTypeId)
                .GroupBy(p => p.CreatedAt.Date) // Group by day
                .Select(g => new DailyAveragePriceDTO
                {
                    Date = g.Key,
                    AveragePrice = g.Average(p => p.Price ?? 0) // Calculate average price
                })
                .OrderBy(d => d.Date) // Sort by date
                .ToListAsync();
        }
    }
}
