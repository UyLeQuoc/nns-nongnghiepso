using nns_backend.Entities;

namespace nns_backend.Interfaces
{
    public interface IProductTypeRepository
    {
        Task<List<ProductType>> GetProductTypesAsync();
        Task<ProductType?> GetProductTypeByIdAsync(int id);
        Task<ProductType> CreateProductTypeAsync(ProductType productType);
        Task UpdateProductTypeAsync(ProductType productType);
        Task DeleteProductTypeAsync(int id);
    }
}
