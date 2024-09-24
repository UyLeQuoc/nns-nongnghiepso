using nns_backend.Entities;

namespace nns_backend.DTO
{
    public class FarmToolCreateDTO
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
        public int? UserId { get; set; }
    }

    public class FarmToolResponseDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class FarmToolUpdateDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? Price { get; set; }
    }
}
