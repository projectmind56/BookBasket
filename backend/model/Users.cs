using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string? UserName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }

        public string? Phone { get; set; }

        [Required]
        public string Role { get; set; } = "student";
        [Required]
        public string Status { get; set; } = "pending";

        // Optional but recommended:
        [JsonIgnore]
        public UserProfile? UserProfile { get; set; }
    }
}
