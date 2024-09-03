using Microsoft.EntityFrameworkCore;
using nns_backend.Entities;
using nns_backend.Interfaces;

namespace nns_backend.Repositories
{
    public class BlogRepository : IBlogRepository
    {
        private readonly NNSDBContext _context;
        public BlogRepository(NNSDBContext context)
        {
            _context = context;
        }

        public async Task<List<Blog>> GetBlogsAsync()
        {
            return await _context.Blogs.ToListAsync();
        }

        public async Task<Blog?> GetBlogByIdAsync(int id)
        {
            return await _context.Blogs.FindAsync(id);
        }

        public async Task<Blog> CreateBlogAsync(Blog blog)
        {
            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return blog;
        }

        public async Task UpdateBlogAsync(Blog blog)
        {
            _context.Entry(blog).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBlogAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog != null)
            {
                _context.Blogs.Remove(blog);
                await _context.SaveChangesAsync();
            }
        }
    }
}
