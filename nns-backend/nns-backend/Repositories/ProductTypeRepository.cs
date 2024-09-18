using Microsoft.EntityFrameworkCore;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Repositories
{
    public class ProductTypeRepository : IProductTypeRepository
    {
        private readonly NNSDBContext _context;
        public ProductTypeRepository(NNSDBContext context)
        {
            _context = context;
        }

        public async Task<List<ProductType>> GetProductTypesAsync()
        {
            return await _context.ProductTypes.ToListAsync();
        }

        public async Task<ProductType?> GetProductTypeByIdAsync(int id)
        {
            return await _context.ProductTypes.FindAsync(id);
        }

        public async Task<ProductType> CreateProductTypeAsync(ProductType productType)
        {
            _context.ProductTypes.Add(productType);
            await _context.SaveChangesAsync();
            return productType;
        }

        public async Task UpdateProductTypeAsync(ProductType productType)
        {
            _context.Entry(productType).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteProductTypeAsync(int id)
        {
            var productType = await _context.ProductTypes.FindAsync(id);
            if (productType != null)
            {
                _context.ProductTypes.Remove(productType);
                await _context.SaveChangesAsync();
            }
        }
    }
}
