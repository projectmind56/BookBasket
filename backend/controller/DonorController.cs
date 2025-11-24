using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonorController : ControllerBase
    {
        private readonly DonorService _donorService;
        private readonly IWebHostEnvironment _env;

        public DonorController(DonorService donorService, IWebHostEnvironment env)
        {
            _donorService = donorService;
            _env = env;
        }

        [HttpPost("addBook")]
        public async Task<IActionResult> AddBook([FromForm] BookUploadDto dto)
        {
            if (dto.Cover == null)
                return BadRequest(new { errors = new { CoverImagePath = new[] { "Cover is required" } } });

            // Unique filename
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(dto.Cover.FileName)}";

            // Full path
            var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var folderPath = Path.Combine(webRoot, "uploads", "covers");

            // Auto-create folder
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fullPath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(fullPath, FileMode.Create);
            await dto.Cover.CopyToAsync(stream);

            var book = new Books
            {
                Title = dto.Title,
                Author = dto.Author,
                ISBN = dto.ISBN,
                Publisher = dto.Publisher,
                Category = dto.Category,
                Quantity = dto.Quantity,
                Description = dto.Description,
                CoverImagePath = $"/uploads/covers/{fileName}",
                DonorId = dto.DonorId,
                SoldQuantity = 0
            };

            _donorService.AddBook(book);
            return Ok(new { message = "Book added successfully!" });
        }

        [HttpPost("addEBook")]
        public async Task<IActionResult> AddEBook([FromForm] EBookUploadDto dto)
        {
            if (dto.EBookFile == null)
                return BadRequest(new { errors = new { EBookPath = new[] { "EBook file is required" } } });

            // Limit file size < 20MB
            if (dto.EBookFile.Length > 20 * 1024 * 1024)
                return BadRequest(new { errors = new { EBookPath = new[] { "File size must be less than 20MB" } } });

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(dto.EBookFile.FileName)}";

            var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var folderPath = Path.Combine(webRoot, "uploads", "ebooks");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fullPath = Path.Combine(folderPath, fileName);
            using var stream = new FileStream(fullPath, FileMode.Create);
            await dto.EBookFile.CopyToAsync(stream);

            var ebook = new EBooks
            {
                Title = dto.Title,
                Author = dto.Author,
                ISBN = dto.ISBN,
                Publisher = dto.Publisher,
                Category = dto.Category,
                Description = dto.Description,
                FilePath = $"/uploads/ebooks/{fileName}",
                DonorId = dto.DonorId,
                DownloadCount = 0
            };

            _donorService.AddEBook(ebook);
            return Ok(new { message = "EBook added successfully!" });
        }

        [HttpGet("getBooksByDonor/{donorId}")]
        public IActionResult GetBooksByDonor(int donorId)
        {
            var books = _donorService.GetBooksByDonor(donorId);
            if (books == null || !books.Any())
                return NotFound(new { message = "No books found for this donor" });

            return Ok(books);
        }

        [HttpGet("getEBooksByDonor/{donorId}")]
        public IActionResult GetEBooksByDonor(int donorId)
        {
            var ebooks = _donorService.GetEBooksByDonor(donorId);
            if (ebooks == null || !ebooks.Any())
                return NotFound(new { message = "No ebooks found for this donor" });

            return Ok(ebooks);
        }

        [HttpPut("updateBook/{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Books updatedBook)
        {
            var book = _donorService.GetBookById(id);
            if (book == null) return NotFound();

            // Update editable fields only
            book.Author = updatedBook.Author;
            book.ISBN = updatedBook.ISBN;
            book.Publisher = updatedBook.Publisher;
            book.Category = updatedBook.Category;
            book.Quantity = updatedBook.Quantity;
            book.Description = updatedBook.Description;

            _donorService.UpdateBook(book);
            return Ok(new { message = "Book updated successfully!" });
        }

        [HttpGet("getAllOrders/{id}")]
        public IActionResult GetAllOrders(int id)
        {
            var orders = _donorService.GetAllOrders(id);
            return Ok(orders);
        }
    }
}
