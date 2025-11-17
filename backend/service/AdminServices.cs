using backend.Context;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;

namespace backend.Services
{
    public class AdminService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AdminService(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // 1. Get all student details -> pending first then accepted
        public async Task<List<StudentDto>> GetAllStudentsAsync()
        {
            return await _db.Users
                .Where(u => u.Role == "student")
                .Include(u => u.UserProfile)
                .OrderBy(u => u.Status == "pending" ? 0 : 1)
                .Select(u => new StudentDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role,
                    Status = u.Status,
                    StudentRollNo = u.UserProfile != null ? u.UserProfile.StudentRollNo : null,
                    CollegeName = u.UserProfile != null ? u.UserProfile.CollegeName : null,
                    UniversityName = u.UserProfile != null ? u.UserProfile.UniversityName : null,
                    AadharNo = u.UserProfile != null ? u.UserProfile.AadharNo : null
                })
                .ToListAsync();
        }

        // 2. Approve a student (set status = accepted)
        public async Task<bool> ApproveStudentAsync(int userId)
        {
            var student = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId && u.Role == "student");
            if (student == null) return false;

            student.Status = "accepted";
            await _db.SaveChangesAsync();

            // Send approval email
            await SendEmailAsync(student.Email, student.UserName, student.Password, true);

            return true;
        }

        // 3. Reject student (update status)
        public async Task<bool> RejectStudentAsync(int userId)
        {
            var student = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId && u.Role == "student");
            if (student == null) return false;

            student.Status = "rejected";
            await _db.SaveChangesAsync();

            // Send rejection email
            await SendEmailAsync(student.Email, student.UserName, student.Password, false);

            return true;
        }

         public async Task<List<DonorDto>> GetAllDonorsAsync()
        {
            return await _db.Users
                .Where(u => u.Role == "donor")
                .OrderBy(u => u.Status == "accepted" ? 0 : 1)
                .Select(u => new DonorDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role,
                })
                .ToListAsync();
        }

        // 4. Send Email Method
        private async Task SendEmailAsync(string toEmail, string userName, string password, bool isApproved)
        {
            var smtpHost = _config["Smtp:Host"];
            var smtpPort = int.Parse(_config["Smtp:Port"]);
            var smtpUser = _config["Smtp:Username"];
            var smtpPass = _config["Smtp:Password"];

            var subject = isApproved ? "BookBasket - Registration Approved" : "BookBasket - Registration Rejected";
            var body = isApproved ? GetApprovalTemplate(userName, toEmail, password) : GetRejectionTemplate(userName, toEmail, password);

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUser, "BookBasket"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }

        // 5. HTML Templates
        private string GetApprovalTemplate(string name, string email, string password)
        {
            return $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2 style='color: green;'>🎉 Congratulations, {name}!</h2>
                <p>Your registration for <b>BookBasket</b> has been <b>approved</b>.</p>
                <p>You can now login using the following credentials:</p>
                <ul>
                    <li><b>Email:</b> {email}</li>
                    <li><b>Password:</b> {password}</li>
                </ul>
                <p>Visit our website to explore books and manage your account.</p>
                <p>Happy Learning! 📚</p>
                <hr>
                <p>BookBasket Team</p>
            </body>
            </html>";
        }

        private string GetRejectionTemplate(string name, string email, string password)
        {
            return $@"
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <h2 style='color: red;'>Hello, {name}</h2>
                <p>We regret to inform you that your registration for <b>BookBasket</b> has been <b>rejected</b>.</p>
                <p>If you believe this is a mistake, please contact our support team with your registration details:</p>
                <ul>
                    <li><b>Email:</b> {email}</li>
                </ul>
                <p>Thank you for your interest in BookBasket.</p>
                <hr>
                <p>BookBasket Team</p>
            </body>
            </html>";
        }
    }
}
