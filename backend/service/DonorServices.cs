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

public List<OrderDetailsDTO> GetAllOrders(int donorId)
{
    var orders = (from o in _context.BookOrders
                  join u in _context.Users on o.User_Id equals u.UserId
                  join up in _context.UserProfile on u.UserId equals up.UserId into upLeft
                  from up in upLeft.DefaultIfEmpty()
                  join d in _context.Users on o.Donor_Id equals d.UserId
                  join b in _context.Books on o.Book_Id equals b.Id
                  where o.Donor_Id == donorId
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

    }
}
