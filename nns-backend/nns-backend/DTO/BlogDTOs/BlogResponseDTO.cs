namespace nns_backend.DTO.BlogDTOs
{
    public class BlogResponseDTO
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Caption { get; set; }
        public string? YoutubeLink { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
