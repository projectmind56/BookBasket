using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class EBooks
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DonorId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        [Required]
        [MaxLength(255)]
        public string Author { get; set; }

        [Required]
        [MaxLength(50)]
        public string ISBN { get; set; }

        [MaxLength(255)]
        public string Publisher { get; set; }

        [Required]
        [MaxLength(100)]
        public string Category { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int DownloadCount { get; set; } = 0;

        public string Description { get; set; }

        public string FilePath { get; set; } // store eBook file path
    }
}
