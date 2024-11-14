namespace nns_backend.DTO
{
    public class ChatResponseDTO
    {
        public int Id { get; set; }
        public string? Question { get; set; }
        public string? Answer { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class ChatCreateDTO
    {
        public string? Question { get; set; }
        public string? Answer { get; set; }
    }

    public class ChatUpdateDTO
    {
        public int Id { get; set; }
        public string? Question { get; set; }
        public string? Answer { get; set; }
    }
}
