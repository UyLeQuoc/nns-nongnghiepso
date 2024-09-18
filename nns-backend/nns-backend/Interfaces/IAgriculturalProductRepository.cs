using nns_backend.Entities;

namespace nns_backend.Interfaces
{
    public interface IAgriculturalProductRepository
    {
        Task<List<AgriculturalProduct>> GetAgriculturalProductsAsync();
        Task<AgriculturalProduct?> GetAgriculturalProductByIdAsync(int id);
        Task<AgriculturalProduct> CreateAgriculturalProductAsync(AgriculturalProduct agriculturalProduct);
        Task UpdateAgriculturalProductAsync(AgriculturalProduct agriculturalProduct);
        Task DeleteAgriculturalProductAsync(int id);
    }
}
