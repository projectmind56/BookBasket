using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class BookOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int User_Id { get; set; }

        [Required]
        public int Donor_Id { get; set; }

        [Required]
        public int Book_Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; }

        [Required]
        [MaxLength(20)]
        public string Isbn_No { get; set; }

        [Required]
        public int Quantity { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;
    }
}
