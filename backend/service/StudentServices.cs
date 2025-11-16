using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.Context;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

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
            bool emailExists = await _db.Users.AnyAsync(u => u.Email == user.Email);
            if (emailExists)
                throw new InvalidOperationException("Email already exists. Please use a different email.");

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
            // Get user by email
            var user = await _db.Users
                .Include(u => u.UserProfile)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return null;

            // Check password (plain text, you should hash in production)
            if (user.Password != password)
                return null;

            return (user);
        }
    }
}
