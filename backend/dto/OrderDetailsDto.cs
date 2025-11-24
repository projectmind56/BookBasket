public class OrderDetailsDTO
    {
        public int OrderId { get; set; }
        public string Category { get; set; }
        public int Quantity { get; set; }
        public DateTime OrderDate { get; set; }

        // User who ordered
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string? StudentRollNo { get; set; }
        public string? CollegeName { get; set; }
        public string? UniversityName { get; set; }

        // Donor details
        public int DonorId { get; set; }
        public string DonorName { get; set; }
        public string DonorEmail { get; set; }

        // Book details
        public int BookId { get; set; }
        public string BookTitle { get; set; }
        public string BookAuthor { get; set; }
        public string BookISBN { get; set; }
        public string BookPublisher { get; set; }
    }