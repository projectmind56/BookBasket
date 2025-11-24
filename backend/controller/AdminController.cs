using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _service;

        public AdminController(AdminService service)
        {
            _service = service;
        }

        // GET: api/admin/students
        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _service.GetAllStudentsAsync();
            return Ok(students);
        }

        // PUT: api/admin/approve/{id}
        [HttpPut("approve/{id}")]
        public async Task<IActionResult> ApproveStudent(int id)
        {
            var result = await _service.ApproveStudentAsync(id);

            if (!result)
                return NotFound(new { message = "Student not found." });

            return Ok(new { message = "Student approved successfully." });
        }

        // DELETE: api/admin/reject/{id}
        [HttpDelete("reject/{id}")]
        public async Task<IActionResult> RejectStudent(int id)
        {
            var result = await _service.RejectStudentAsync(id);

            if (!result)
                return NotFound(new { message = "Student not found." });

            return Ok(new { message = "Student rejected and removed successfully." });
        }

        [HttpGet("donors")]
        public async Task<IActionResult> GetAllDonors()
        {
            var donors = await _service.GetAllDonorsAsync();
            return Ok(donors);
        }

                [HttpGet("getAllOrders")]
        public IActionResult GetAllOrders()
        {
            var orders = _service.GetAllOrders();
            return Ok(orders);
        }
    }
}
