namespace nns_backend.DTO
{
    public class UpdateAgentProductPreferenceDTO
    {
        public decimal TodayPrice { get; set; }
        public string Description { get; set; }
        public int ProductTypeId { get; set; }
        public int UserId { get; set; }
    }
}
