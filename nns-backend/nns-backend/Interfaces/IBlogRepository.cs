using nns_backend.Entities;

namespace nns_backend.Interfaces
{
    public interface IBlogRepository
    {
        Task<List<Blog>> GetBlogsAsync();
        Task<Blog?> GetBlogByIdAsync(int id);
        Task<Blog> CreateBlogAsync(Blog blog);
        Task UpdateBlogAsync(Blog blog);
        Task DeleteBlogAsync(int id);
    }
}
