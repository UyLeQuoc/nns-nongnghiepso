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
        public DbSet<AgriculturalProduct> AgriculturalProducts { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

