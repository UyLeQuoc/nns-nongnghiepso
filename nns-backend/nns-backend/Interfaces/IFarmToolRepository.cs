using nns_backend.Entities;

public interface IFarmToolRepository
{
    Task<List<FarmTool>> GetFarmToolsAsync();
    Task<FarmTool?> GetFarmToolByIdAsync(int id);
    Task<List<FarmTool>> GetFarmToolsByUserIdAsync(int userId); // New method
    Task<FarmTool> CreateFarmToolAsync(FarmTool farmTool);
    Task UpdateFarmToolAsync(FarmTool farmTool);
    Task DeleteFarmToolAsync(int id);
}
