using Microsoft.EntityFrameworkCore;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Repositories
{
    public class AgriculturalProductRepository : IAgriculturalProductRepository
    {
        private readonly NNSDBContext _context;
        public AgriculturalProductRepository(NNSDBContext context)
        {
            _context = context;
        }

        public async Task<List<AgriculturalProduct>> GetAgriculturalProductsAsync()
        {
            return await _context.AgriculturalProducts.Include(x => x.ProductTypes).ToListAsync();
        }

        public async Task<AgriculturalProduct?> GetAgriculturalProductByIdAsync(int id)
        {
            return await _context.AgriculturalProducts.Include(x => x.ProductTypes).FirstOrDefaultAsync(y => y.Id == id);
        }

        public async Task<AgriculturalProduct> CreateAgriculturalProductAsync(AgriculturalProduct agriculturalProduct)
        {
            _context.AgriculturalProducts.Add(agriculturalProduct);
            await _context.SaveChangesAsync();
            return agriculturalProduct;
        }

        public async Task UpdateAgriculturalProductAsync(AgriculturalProduct agriculturalProduct)
        {
            _context.Entry(agriculturalProduct).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAgriculturalProductAsync(int id)
        {
            var product = await _context.AgriculturalProducts.FindAsync(id);
            if (product != null)
            {
                _context.AgriculturalProducts.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
