using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using nns_backend.Entities;

namespace nns_backend
{
    public class NNSDBContext : IdentityDbContext<User, Role, int>
    {
        public NNSDBContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Blog> Blogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

