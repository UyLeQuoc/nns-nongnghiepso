namespace nns_backend.Entities
{
    public class AgriculturalProduct : BaseEntity
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? BeginPrice { get; set; } = decimal.Zero;
    }
}
