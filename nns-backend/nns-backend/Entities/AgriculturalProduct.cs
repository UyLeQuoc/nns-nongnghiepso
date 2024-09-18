namespace nns_backend.Entities
{
    public class AgriculturalProduct : BaseEntity
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? BeginPrice { get; set; } = decimal.Zero;
        public virtual ICollection<ProductType> ProductTypes { get; set; }
    }
}
