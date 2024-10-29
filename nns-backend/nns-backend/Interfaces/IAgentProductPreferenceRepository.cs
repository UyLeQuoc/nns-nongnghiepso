using nns_backend.DTO;
using nns_backend.Entities;

namespace nns_backend.Interfaces
{
    public interface IAgentProductPreferenceRepository
    {
        Task TransferTodayPricesToProductTypePricesAsync(DateTime priceUpdateDTO);
        Task<List<DailyAveragePriceDTO>> GetDailyAveragePriceAsync(int productTypeId);
        Task<List<AgentProductPreferenceResponseDTO>> GetAgentProductPreferencesByUserIdAsync(int userId);
        Task<List<AgentProductPreferenceResponseDTO>> GetAgentProductPreferencesByProductTypeIdAsync(int productTypeId);
        Task<AgentProductPreference> UpdateAgentProductPreferenceAsync(UpdateAgentProductPreferenceDTO updateDTO);
        Task<List<ProductTypePriceDifferenceDTO>> GetProductTypePricesWithDifferencesAsync(int userId, DateTime currentTime);
        Task<List<AgriculturalProductWithPriceDTO>> GetAllAgriculturalProductsWithPrices(DateTime targetDate);
        Task<List<DailyPriceDTO>> GetDailyPricesForUserProductTypeAsync(int userId, int productTypeId);
        Task<List<DailyPriceDTO>> GetDailyPricesForProductTypeAsync(int productTypeId);
        Task<List<Dictionary<string, object>>> GetDailyPricesForProductType2Async(int productTypeId);
    }
}
