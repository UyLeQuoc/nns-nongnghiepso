using nns_backend.DTO;

namespace nns_backend.Interfaces
{
    public interface IAgentProductPreferenceRepository
    {
        Task TransferTodayPricesToProductTypePricesAsync(DateTime priceUpdateDTO);
        Task<List<DailyAveragePriceDTO>> GetDailyAveragePriceAsync(int productTypeId);
        Task<List<AgentProductPreferenceResponseDTO>> GetAgentProductPreferencesByUserIdAsync(int userId);
        Task<List<AgentProductPreferenceResponseDTO>> GetAgentProductPreferencesByProductTypeIdAsync(int productTypeId);
    }
}
