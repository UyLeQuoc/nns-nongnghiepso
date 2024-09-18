namespace nns_backend.DTO
{
    public class ProductTypeCreateDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int AgriculturalProductId { get; set; }
    }

    public class ProductTypeResponseDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int AgriculturalProductId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ProductTypeUpdateDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int AgriculturalProductId { get; set; }
    }
}
