using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class UserProfile
    {
        [Key]
        public int ProfileId { get; set; }

        public string? StudentRollNo { get; set; }

        public string? CollegeName { get; set; }

        public string? UniversityName { get; set; }

        [MaxLength(12)]
        public string? AadharNo { get; set; }

        // Foreign key reference to UserModel
        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public Users User { get; set; }
    }
}
