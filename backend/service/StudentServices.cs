using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Context;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Net.Mail;
using System.Net;

namespace backend.Services
{
    public class StudentService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public StudentService(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<string> GenerateJwtTokenAsync(Users user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<Users> CreateStudentWithProfileAsync(Users user, UserProfile profile)
        {
            // Check if email already exists
            bool emailExists = await _db.Users.AnyAsync(u => u.Email == user.Email);
            if (emailExists)
                throw new InvalidOperationException("Email already exists. Please use a different email.");

            // Automatically set status based on role
            if (user.Role.ToLower() == "donor")
                user.Status = "accepted";
            else if (user.Role.ToLower() == "student")
                user.Status = "pending";

            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                _db.Users.Add(user);
                await _db.SaveChangesAsync(); // generates UserId

                profile.UserId = user.UserId;
                _db.UserProfile.Add(profile);
                await _db.SaveChangesAsync();

                await transaction.CommitAsync();

                user.UserProfile = profile;

                // Send registration email
                await SendRegistrationEmailAsync(user);

                return user;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<Users> AuthenticateStudentAsync(string email, string password)
        {
            var user = await _db.Users
                .Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null) return null;

            if (user.Password != password) return null;

            return user;
        }

        public List<Books> GetAvailableBooks()
        {
            return _db.Books
                           .Where(b => b.Quantity > 0)
                           .ToList();
        }

        public List<EBooks> GetAvailableEBooks()
        {
            return _db.EBooks.ToList();
        }

public List<OrderDetailsDTO> GetMyOrders()
{
    var orders = (from o in _db.BookOrders
                  join u in _db.Users on o.User_Id equals u.UserId
                  join up in _db.UserProfile on u.UserId equals up.UserId into upLeft
                  from up in upLeft.DefaultIfEmpty()
                  join d in _db.Users on o.Donor_Id equals d.UserId
                  join b in _db.Books on o.Book_Id equals b.Id
                  where o.Category != "E-Book"
                  select new OrderDetailsDTO
                  {
                      OrderId = o.Id,
                      Category = o.Category,
                      Quantity = o.Quantity,
                      OrderDate = o.OrderDate,

                      UserId = u.UserId,
                      UserName = u.UserName,
                      Email = u.Email,
                      Phone = u.Phone,
                      StudentRollNo = up != null ? up.StudentRollNo : null,
                      CollegeName = up != null ? up.CollegeName : null,
                      UniversityName = up != null ? up.UniversityName : null,

                      DonorId = d.UserId,
                      DonorName = d.UserName,
                      DonorEmail = d.Email,

                      BookId = b.Id,
                      BookTitle = b.Title,
                      BookAuthor = b.Author,
                      BookISBN = b.ISBN,
                      BookPublisher = b.Publisher
                  }).ToList();

    return orders;
}

        public async Task<bool> PlaceOrderAsync(BookOrderDto dto)
        {
            // 1️⃣ Get book
            var book = await _db.Books.FirstOrDefaultAsync(b => b.Id == dto.Book_Id);
            if (book == null)
                throw new Exception("Book not found");

            // 2️⃣ Validate stock
            if (book.Quantity < dto.Quantity)
                throw new Exception("Not enough stock available");

            // 3️⃣ Reduce available quantity
            book.Quantity -= dto.Quantity;

            // 4️⃣ Increase sold quantity
            book.SoldQuantity += dto.Quantity;

            // 5️⃣ Create order record
            var order = new BookOrder
            {
                User_Id = dto.User_Id,
                Donor_Id = dto.Donor_Id,
                Book_Id = dto.Book_Id,
                Category = dto.Category,
                Isbn_No = dto.Isbn_No,
                Quantity = dto.Quantity,
                OrderDate = DateTime.Now
            };

            _db.BookOrders.Add(order);

            // 6️⃣ Save both Updates
            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DownloadEBook(BookOrderDto dto)
        {
            // 1️⃣ Get book
            var book = await _db.EBooks.FirstOrDefaultAsync(b => b.Id == dto.Book_Id);
            if (book == null)
                throw new Exception("Book not found");

            // 4️⃣ Increase download quantity
            book.DownloadCount += dto.Quantity;

            // 5️⃣ Create order record
            var order = new BookOrder
            {
                User_Id = dto.User_Id,
                Donor_Id = dto.Donor_Id,
                Book_Id = dto.Book_Id,
                Category = dto.Category,
                Isbn_No = dto.Isbn_No,
                Quantity = dto.Quantity,
                OrderDate = DateTime.Now
            };

            _db.BookOrders.Add(order);

            // 6️⃣ Save both Updates
            await _db.SaveChangesAsync();

            return true;
        }

        private async Task SendRegistrationEmailAsync(Users user)
        {
            string subject = "Welcome to BookBasket!";
            string body = "";

            if (user.Role.ToLower() == "student")
            {
                body = $@"
                <html>
                <body>
                    <h2>Hi {user.UserName},</h2>
                    <p>Thank you for choosing <strong>BookBasket</strong>!</p>
                    <p>Your account has been successfully registered and is pending admin verification.</p>
                    <p>Once approved, you will be notified via email.</p>
                    <p><strong>Email:</strong> {user.Email}<br/>
                       <strong>Password:</strong> {user.Password}</p>
                    <br/>
                    <p>Regards,<br/>BookBasket Team</p>
                </body>
                </html>";
            }
            else if (user.Role.ToLower() == "donor")
            {
                body = $@"
                <html>
                <body>
                    <h2>Hi {user.UserName},</h2>
                    <p>Thank you for choosing <strong>BookBasket</strong>!</p>
                    <p>Your account has been successfully registered and is already <strong>accepted</strong>.</p>
                    <p><strong>Email:</strong> {user.Email}<br/>
                       <strong>Password:</strong> {user.Password}</p>
                    <br/>
                    <p>Regards,<br/>BookBasket Team</p>
                </body>
                </html>";
            }

            using var client = new SmtpClient(_config["Smtp:Host"], int.Parse(_config["Smtp:Port"]))
            {
                Credentials = new NetworkCredential(_config["Smtp:Username"], _config["Smtp:Password"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["Smtp:Username"], "BookBasket"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(user.Email);

            await client.SendMailAsync(mailMessage);
        }
    }
}
