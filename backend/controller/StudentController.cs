using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _service;

        public StudentController(StudentService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new Users
            {
                UserName = dto.UserName,
                Email = dto.Email,
                Password = dto.Password,
                Phone = dto.Phone,
                Role = dto.Role ?? "student",
                Status = "pending" // set default status to pending
            };

            var profile = new UserProfile
            {
                StudentRollNo = dto.StudentRollNo,
                CollegeName = dto.CollegeName,
                UniversityName = dto.UniversityName,
                AadharNo = dto.AadharNo
            };

            try
            {
                await _service.CreateStudentWithProfileAsync(user, profile);

                // Return success message
                return Ok(new
                {
                    message = "Registration successful. Pending admin approval."
                });
            }
            catch (InvalidOperationException ex) // handle known errors
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Something went wrong. Please try again." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _service.AuthenticateStudentAsync(dto.Email, dto.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            if (user.Status != "accepted")
                return Unauthorized(new { message = "Your account is pending admin approval." });

            var token = await _service.GenerateJwtTokenAsync(user);

            return Ok(new
            {
                message = "Login successful",
                token
            });
        }

        [HttpGet("getAvailableBooks")]
        public IActionResult GetAvailableBooks()
        {
            var books = _service.GetAvailableBooks();
            return Ok(books);
        }

        [HttpGet("getAvailableEBooks")]
        public IActionResult GetAvailableEBooks()
        {
            var ebooks = _service.GetAvailableEBooks();
            return Ok(ebooks);
        }

        [HttpGet("getMyOrders")]
        public IActionResult GetMyOrders()
        {
            var orders = _service.GetMyOrders();
            return Ok(orders);
        }

        [HttpPost("orderBook")]
        public async Task<IActionResult> OrderBook([FromBody] BookOrderDto dto)
        {
            if (!ModelState.IsValid || dto == null)
                return BadRequest("Invalid request data.");

            bool result = await _service.PlaceOrderAsync(dto);

            if (!result)
                return StatusCode(500, "Error while placing order.");

            return Ok(new { message = "Order placed successfully!" });
        }
        [HttpPost("downloadEBook")]
        public async Task<IActionResult> DownloadEBook([FromBody] BookOrderDto dto)
        {
            if (!ModelState.IsValid || dto == null)
                return BadRequest("Invalid request data.");

            bool result = await _service.DownloadEBook(dto);

            if (!result)
                return StatusCode(500, "Error while placing order.");

            return Ok(new { message = "Order placed successfully!" });
        }
    }
}
