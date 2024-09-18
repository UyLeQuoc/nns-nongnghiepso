namespace nns_backend.Entities
{
    public class ProductType : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int AgriculturalProductId { get; set; }
        // Foreign key
        public AgriculturalProduct AgriculturalProduct { get; set; }
        // Navigation properties

    }
}
