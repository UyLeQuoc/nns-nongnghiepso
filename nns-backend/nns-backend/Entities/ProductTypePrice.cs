namespace nns_backend.Entities
{
    public class ProductTypePrice : BaseEntity
    {
        public int ProductTypeId { get; set; } // Foreign key to ProductTypes
        public ProductType ProductType { get; set; } // Navigation property

        public int UserId { get; set; } // Foreign key to Users
        public User User { get; set; } // Navigation property

        public decimal? Price { get; set; } // Product price
        public string? Note { get; set; } // Optional note about the price
    }
}
