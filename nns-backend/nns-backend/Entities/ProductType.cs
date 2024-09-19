namespace nns_backend.Entities
{
    public class ProductType : BaseEntity
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int AgriculturalProductId { get; set; }
        public virtual AgriculturalProduct AgriculturalProduct { get; set; }

        public virtual ICollection<AgentProductPreference> AgentProductPreferences { get; set; }
    }
}
