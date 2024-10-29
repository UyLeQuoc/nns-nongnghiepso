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
                var timeSinceLastUpdate = _currentTime.GetCurrentTime() - preference.UpdatedAt;

                // Only create ProductTypePrice if TodayPrice is not null or 0
                if (preference.TodayPrice != null && preference.TodayPrice > 0)
                {
                    // Determine if a note is needed based on last update time
                    var productTypePrice = new ProductTypePrice
                    {
                        ProductTypeId = preference.ProductTypeId,
                        UserId = preference.UserId,
                        Price = preference.TodayPrice,
                        Note = timeSinceLastUpdate.HasValue && timeSinceLastUpdate.Value.TotalHours > 24
                            ? $"Giá của ngày {preference.UpdatedAt?.ToString("dd/MM/yyyy")}"
                            : "", // Add a note only if it's been more than 24 hours
                        CreatedAt = priceUpdateDTO,
                        ModifiedAt = _currentTime.GetCurrentTime()
                    };

                    _context.ProductTypePrices.Add(productTypePrice);
                }
                else
                {
                    // If TodayPrice is 0, still create ProductTypePrice but add the note
                    var productTypePrice = new ProductTypePrice
                    {
                        ProductTypeId = preference.ProductTypeId,
                        UserId = preference.UserId,
                        Price = preference.TodayPrice, // It will be 0
                        Note = $"Giá của ngày {preference.UpdatedAt?.ToString("dd/MM/yyyy")}", // Note includes the updated date
                        CreatedAt = priceUpdateDTO,
                        ModifiedAt = _currentTime.GetCurrentTime()
                    };

                    _context.ProductTypePrices.Add(productTypePrice);
                }

                // No reset for TodayPrice as requested
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

        public async Task<List<AgentProductPreferenceResponseDTO>> GetAgentProductPreferencesByUserIdAsync(int userId)
        {
            // Query the AgentProductPreference table for the given userId
            var preferences = await _context.AgentProductPreferences
                .Where(p => p.UserId == userId)
                .Include(p => p.ProductType) // Include the related ProductType data
                .Include(p => p.User) // Include the related User data
                .ToListAsync();

            // Map the result to AgentProductPreferenceResponseDTO
            var result = preferences.Select(p => new AgentProductPreferenceResponseDTO
            {
                UserId = p.UserId,
                ProductTypeId = p.ProductTypeId,
                Description = p.Description,
                TodayPrice = p.TodayPrice ?? 0,
                CreatedAt = p.CreatedAt ?? default(DateTime),
                UpdatedAt = p.UpdatedAt ?? default(DateTime),
                ProductType = new ProductTypeResponseDTO
                {
                    Id = p.ProductType.Id,
                    Name = p.ProductType.Name,
                    Description = p.ProductType.Description
                }
            }).ToList();

            return result;
        }

        public async Task<List<AgentProductPreferenceResponseDTO>> GetAgentProductPreferencesByProductTypeIdAsync(int productTypeId)
        {
            // Query the AgentProductPreference table for the given productTypeId
            var preferences = await _context.AgentProductPreferences
                .Where(p => p.ProductTypeId == productTypeId)
                .Include(p => p.ProductType) // Include the related ProductType data
                .Include(p => p.User) // Include the related User data
                .ToListAsync();

            // Map the result to AgentProductPreferenceResponseDTO
            var result = preferences.Select(p => new AgentProductPreferenceResponseDTO
            {
                UserId = p.UserId,
                ProductTypeId = p.ProductTypeId,
                Description = p.Description,
                TodayPrice = p.TodayPrice ?? 0,
                CreatedAt = p.CreatedAt ?? default(DateTime),
                UpdatedAt = p.UpdatedAt ?? default(DateTime),
                ProductType = new ProductTypeResponseDTO
                {
                    Id = p.ProductType.Id,
                    Name = p.ProductType.Name,
                    Description = p.ProductType.Description
                },
                User = new UserResponseDTO
                {
                    UserId = p.User.Id,
                    FullName = p.User.FullName ?? "",
                    Email = p.User.Email ?? "",
                    Dob = p.User.Dob ?? new DateTime(),
                    PhoneNumber = p.User.PhoneNumber ?? "",
                    ImageUrl = p.User.ImageUrl ?? "",
                    ThumbnailUrl = p.User.ThumbnailUrl ?? "",
                    Description = p.User.Description ?? "",
                    Address = p.User.Address ?? ""
                }
            }).ToList();

            return result;
        }

        public async Task<AgentProductPreference> UpdateAgentProductPreferenceAsync(UpdateAgentProductPreferenceDTO updateDTO)
        {
            var preference = await _context.AgentProductPreferences
           .FirstOrDefaultAsync(p => p.UserId == updateDTO.UserId && p.ProductTypeId == updateDTO.ProductTypeId);

            if (preference == null)
            {
                throw new Exception("Agent product preference not found.");
            }

            // Update the preference
            preference.TodayPrice = updateDTO.TodayPrice;
            preference.Description = updateDTO.Description;
            preference.CreatedAt = _currentTime.GetCurrentTime();
            preference.UpdatedAt = _currentTime.GetCurrentTime();

            _context.AgentProductPreferences.Update(preference);
            await _context.SaveChangesAsync();

            return preference;
        }

        public async Task<List<ProductTypePriceDifferenceDTO>> GetProductTypePricesWithDifferencesAsync(int userId, DateTime currentTime)
        {
            var currentDay = currentTime.TimeOfDay.Hours >= 8 ? currentTime.Date : currentTime.Date.AddDays(-1);
            var previousDay = currentDay.AddDays(-1);

            // Get today's prices for all product types of the user
            var todayPrices = await _context.ProductTypePrices
                .Where(p => p.UserId == userId && p.CreatedAt.Date == currentDay)
                .ToListAsync();

            // Get yesterday's prices for comparison
            var yesterdayPrices = await _context.ProductTypePrices
                .Where(p => p.UserId == userId && p.CreatedAt.Date == previousDay)
                .ToListAsync();

            var result = new List<ProductTypePriceDifferenceDTO>();

            // Get all ProductTypes from AgentProductPreference table for the user
            var preferences = await _context.AgentProductPreferences
                .Where(p => p.UserId == userId)
                .Include(p => p.ProductType)
                .ToListAsync();

            foreach (var preference in preferences)
            {
                var todayPrice = todayPrices.FirstOrDefault(p => p.ProductTypeId == preference.ProductTypeId)?.Price ?? 0;
                var yesterdayPrice = yesterdayPrices.FirstOrDefault(p => p.ProductTypeId == preference.ProductTypeId)?.Price ?? 0;

                result.Add(new ProductTypePriceDifferenceDTO
                {
                    ProductTypeId = preference.ProductTypeId,
                    ProductType = preference.ProductType,
                    AgentProductPreference = preference,
                    TodayPrice = todayPrice,
                    YesterdayPrice = yesterdayPrice,
                    PriceDifference = todayPrice - yesterdayPrice
                });
            }

            return result;
        }

        public async Task<List<AgriculturalProductWithPriceDTO>> GetAllAgriculturalProductsWithPrices(DateTime targetDate)
        {
            var products = await _context.AgriculturalProducts
                .Include(p => p.ProductTypes)
                    .ThenInclude(pt => pt.ProductTypePrices) // Include the ProductTypePrices
                        .ThenInclude(pt => pt.User)
                .ToListAsync();

            var result = products.Select(p => new AgriculturalProductWithPriceDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ImageUrl = p.ImageUrl,
                BeginPrice = p.BeginPrice,
                AveragePrice = p.ProductTypes
                    .SelectMany(pt => pt.ProductTypePrices
                        .Where(ptp => ptp.CreatedAt.Date == targetDate.Date)
                        .Select(ptp => ptp.Price))
                    .DefaultIfEmpty()
                    .Average(),
                TodayMinPrice = p.ProductTypes
                    .SelectMany(pt => pt.ProductTypePrices
                        .Where(ptp => ptp.CreatedAt.Date == targetDate.Date)
                        .Select(ptp => ptp.Price))
                    .DefaultIfEmpty() // Ensure we handle cases with no prices
                    .Min(), // Calculate the minimum price
                TodayMaxPrice = p.ProductTypes
                    .SelectMany(pt => pt.ProductTypePrices
                        .Where(ptp => ptp.CreatedAt.Date == targetDate.Date)
                        .Select(ptp => ptp.Price))
                    .DefaultIfEmpty() // Ensure we handle cases with no prices
                    .Max(), // Calculate the maximum price
                ProductTypes = p.ProductTypes.Select(pt => new ProductTypeWithPriceDTO
                {
                    Id = pt.Id,
                    Name = pt.Name,
                    Description = pt.Description,
                    Prices = pt.ProductTypePrices
                        .Where(ptp => ptp.CreatedAt.Date == targetDate.Date)
                        .Select(ptp => new AgentProductPriceDTO
                        {
                            UserId = ptp.UserId,
                            User = ptp.User,
                            Price = ptp.Price,
                            Note = ptp.Note
                        }).ToList()
                }).ToList()
            }).ToList();

            return result;
        }

        public async Task<List<DailyPriceDTO>> GetDailyPricesForUserProductTypeAsync(int userId, int productTypeId)
        {
            var dailyPrices = await _context.ProductTypePrices
                .Where(p => p.UserId == userId && p.ProductTypeId == productTypeId)
                .GroupBy(p => p.CreatedAt.Date)
                .Select(g => new DailyPriceDTO
                {
                    Date = g.Key,
                    Price = g.Average(p => p.Price ?? 0),
                    Note = g.FirstOrDefault().Note // Lấy Note của bản ghi đầu tiên trong nhóm
                })
                .OrderBy(d => d.Date)
                .ToListAsync();

            return dailyPrices;
        }

        public async Task<List<DailyPriceDTO>> GetDailyPricesForProductTypeAsync(int productTypeId)
        {
            var dailyPrices = await _context.ProductTypePrices
                .Where(p => p.ProductTypeId == productTypeId)
                .GroupBy(p => p.CreatedAt.Date)
                .Select(g => new DailyPriceDTO
                {
                    Date = g.Key,
                    Price = g.Average(p => p.Price ?? 0),
                    Note = g.FirstOrDefault().Note // Lấy Note của bản ghi đầu tiên trong nhóm
                })
                .OrderBy(d => d.Date)
                .ToListAsync();

            return dailyPrices;
        }



    }
}
