using backend.Context;
using backend.Models;

namespace backend.Services
{
    public class DonorService
    {
        private readonly AppDbContext _context;

        public DonorService(AppDbContext context)
        {
            _context = context;
        }

        public void AddBook(Books book)
        {
            _context.Books.Add(book);
            _context.SaveChanges();
        }

        public void AddEBook(EBooks ebook)
        {
            _context.EBooks.Add(ebook);
            _context.SaveChanges();
        }
        public List<Books> GetBooksByDonor(int donorId)
        {
            return _context.Books
                           .Where(b => b.DonorId == donorId)
                           .ToList(); // Works because _context.Books is a DbSet<Books>
        }

        // ✅ Get all ebooks by donor ID
        public List<EBooks> GetEBooksByDonor(int donorId)
        {
            return _context.EBooks
                           .Where(e => e.DonorId == donorId)
                           .ToList(); // Works because _context.EBooks is a DbSet<EBooks>
        }

        public void UpdateBook(Books book)
        {
            _context.Books.Update(book);
            _context.SaveChanges();
        }

        public Books GetBookById(int id)
        {
            return _context.Books.FirstOrDefault(b => b.Id == id);
        }
    }
}
