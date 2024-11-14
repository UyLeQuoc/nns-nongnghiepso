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
        public DbSet<AgentProductPreference> AgentProductPreferences { get; set; }
        public DbSet<ProductTypePrice> ProductTypePrices { get; set; }
        public DbSet<FarmTool> FarmTools { get; set; }
        public DbSet<Chat> Chats { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AgentProductPreference>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.ProductTypeId });

                entity.Property(e => e.Description)
                      .HasMaxLength(255)
                      .IsRequired(false); // Description can be optional if required

                entity.Property(e => e.TodayPrice)
                      .HasColumnType("decimal(18,2)")
                      .IsRequired();

                entity.Property(e => e.CreatedAt)
                      .IsRequired();

                entity.Property(e => e.UpdatedAt)
                      .IsRequired();

                // Relationships
                entity.HasOne(e => e.User)
                      .WithMany(u => u.AgentProductPreferences)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.ProductType)
                      .WithMany(p => p.AgentProductPreferences)
                      .HasForeignKey(e => e.ProductTypeId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

