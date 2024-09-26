using nns_backend.Entities;

namespace nns_backend.DTO
{
    public class AgentProductPreferenceCreateDTO
    {
        public int ProductTypeId { get; set; }
        public string Description { get; set; }
    }

    public class AgentProductPreferenceResponseDTO
    {
        public int UserId { get; set; }
        public int ProductTypeId { get; set; }
        public string Description { get; set; }
        public decimal TodayPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ProductTypeResponseDTO? ProductType { get; set; }
        public UserResponseDTO? User { get; set; }
    }

    public class AgentProductPreferenceShortResponseDTO
    {
        public int UserId { get; set; }
        public int ProductTypeId { get; set; }
        public string Description { get; set; }
        public decimal TodayPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ProductTypeResponseDTO? ProductType { get; set; }
    }

    public class ProductTypePriceDifferenceDTO
    {
        public int ProductTypeId { get; set; }
        public ProductType ProductType { get; set; }
        public AgentProductPreference AgentProductPreference { get; set; }
        public decimal TodayPrice { get; set; }
        public decimal YesterdayPrice { get; set; }
        public decimal PriceDifference { get; set; }
    }

}
