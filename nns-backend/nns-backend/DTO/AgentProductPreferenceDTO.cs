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
        public ProductTypeResponseDTO ProductType { get; set; }
    }

}
