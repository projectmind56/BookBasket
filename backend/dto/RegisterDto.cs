    // DTO to accept user + profile fields
    public class RegisterDto
    {
        // User fields
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string? Phone { get; set; }
        public string? Role { get; set; }

        // Profile fields
        public string? StudentRollNo { get; set; }
        public string? CollegeName { get; set; }
        public string? UniversityName { get; set; }
        public string? AadharNo { get; set; }
    }
