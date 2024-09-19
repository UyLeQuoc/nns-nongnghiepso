using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace nns_backend.Entities
{
    public class AgentProductPreference
    {
        [Key, Column(Order = 0)]
        public int UserId { get; set; }

        [Key, Column(Order = 1)]
        public int ProductTypeId { get; set; }
        public string? Description { get; set; }

        public decimal? TodayPrice { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public User User { get; set; }
        public ProductType ProductType { get; set; }
    }
}
