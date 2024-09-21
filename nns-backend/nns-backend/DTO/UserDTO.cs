namespace nns_backend.DTO
{
    public class UserSignupDTO
    {
        public string Email { get; set; }
        public string? FullName { get; set; }
        public DateTime? Dob { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; } = "";
        public string? ThumbnailUrl { get; set; } = "";
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string Password { get; set; }
        public List<AgentProductPreferenceCreateDTO> agentProductPreferenceCreateDTOs { get; set; }
    }

    public class UserLoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ResponseLoginDTO
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime? Dob { get; set; }
        public string PhoneNumber { get; set; }
        public string ImageUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public List<string> Roles { get; set; }
        public List<AgentProductPreferenceResponseDTO>? AgentProductPreferences { get; set; }
    }

    public class UserShortResponseDTO
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime? Dob { get; set; }
        public string PhoneNumber { get; set; }
        public string ImageUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public List<string> Roles { get; set; }
        public List<AgentProductPreferenceResponseDTO>? AgentProductPreferences { get; set; }
    }

    public class UserUpdateDTO
    {
        public string? FullName { get; set; }
        public DateTime? Dob { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
    }

    public class UserResponseDTO
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime? Dob { get; set; }
        public string PhoneNumber { get; set; }
        public string ImageUrl { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
    }
}
