﻿using Microsoft.AspNetCore.Identity;

namespace nns_backend.Entities
{
    public class User : IdentityUser<int>
    {
        public string? FullName { get; set; }
        public DateTime? Dob { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; } = "";
        public string? ThumbnailUrl { get; set; } = "";
        public string? Description { get; set; }
        public string? Address { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletionDate { get; set; }
        public int? DeleteBy { get; set; }
        public bool? IsDeleted { get; set; } = false;

        public virtual ICollection<AgentProductPreference> AgentProductPreferences { get; set; }
    }
}
