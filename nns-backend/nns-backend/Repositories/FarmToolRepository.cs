using Microsoft.EntityFrameworkCore;
using nns_backend.Entities;

namespace nns_backend.Repositories
{
    public class FarmToolRepository : IFarmToolRepository
    {
        private readonly NNSDBContext _context;

        public FarmToolRepository(NNSDBContext context)
        {
            _context = context;
        }

        public async Task<List<FarmTool>> GetFarmToolsAsync()
        {
            return await _context.FarmTools.ToListAsync();
        }

        public async Task<FarmTool?> GetFarmToolByIdAsync(int id)
        {
            return await _context.FarmTools.FindAsync(id);
        }

        public async Task<FarmTool> CreateFarmToolAsync(FarmTool farmTool)
        {
            _context.FarmTools.Add(farmTool);
            await _context.SaveChangesAsync();
            return farmTool;
        }

        public async Task UpdateFarmToolAsync(FarmTool farmTool)
        {
            _context.Entry(farmTool).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFarmToolAsync(int id)
        {
            var tool = await _context.FarmTools.FindAsync(id);
            if (tool != null)
            {
                _context.FarmTools.Remove(tool);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<FarmTool>> GetFarmToolsByUserIdAsync(int userId)
        {
            return await _context.FarmTools
                                .Include(tool => tool.User)
                                 .Where(tool => tool.UserId == userId)
                                 .ToListAsync();
        }
    }
}
