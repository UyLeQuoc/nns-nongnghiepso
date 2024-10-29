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

    public class AgriculturalProductWithPriceDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? BeginPrice { get; set; }
        public decimal? AveragePrice { get; set; }
        public decimal? TodayMinPrice { get; set; } // Minimum price for today
        public decimal? TodayMaxPrice { get; set; } // Maximum price for today
        public List<ProductTypeWithPriceDTO> ProductTypes { get; set; }
    }

    public class ProductTypeWithPriceDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public List<AgentProductPriceDTO> Prices { get; set; }
    }

    public class AgentProductPriceDTO
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public decimal? Price { get; set; }
        public string? Note { get; set; }
    }

    public class DailyPriceDTO
    {
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
        public string Note { get; set; } // Thêm Note vào DTO
    }
}
