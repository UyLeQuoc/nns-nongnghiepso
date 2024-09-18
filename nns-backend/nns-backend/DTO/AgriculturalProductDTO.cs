namespace nns_backend.DTO
{
    public class AgriculturalProductCreateDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? BeginPrice { get; set; }
    }

    public class AgriculturalProductResponseDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? BeginPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AgriculturalProductUpdateDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? BeginPrice { get; set; }
    }
}
