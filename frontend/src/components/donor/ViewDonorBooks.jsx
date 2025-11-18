import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Technology"];

function ViewDonorBooks() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [viewBook, setViewBook] = useState(null);
  const [search, setSearch] = useState("");

  const getDonorId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.nameid || decoded.DonorId || decoded.NameIdentifier;
    } catch {
      return null;
    }
  };

  const fetchBooks = async () => {
    const donorId = getDonorId();
    if (!donorId) {
      toast.error("Donor not logged in!");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5275/api/Donor/getBooksByDonor/${donorId}`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = books.filter((book) =>
      [book.title, book.author, book.isbn, book.publisher, book.category]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [search, books]);

  const handleEditClick = (book) => setEditingBook(book);
  const handleViewClick = (book) => setViewBook(book);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingBook({ ...editingBook, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5275/api/Donor/updateBook/${editingBook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBook),
      });
      if (!res.ok) throw new Error("Failed to update book");
      toast.success("Book updated successfully!");
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading books...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">My Donated Books</h2>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Title, Author, ISBN, Publisher, Category"
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Edit Modal Overlay */}
      {editingBook && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div className="card p-4" style={{ width: "500px", maxHeight: "90%", overflowY: "auto" }}>
            <h5 className="mb-3">{editingBook.title}</h5>

            <div className="mb-3">
              <label className="form-label">Author</label>
              <input type="text" name="author" className="form-control" value={editingBook.author} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">ISBN</label>
              <input type="text" name="isbn" className="form-control" value={editingBook.isbn} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Publisher</label>
              <input type="text" name="publisher" className="form-control" value={editingBook.publisher} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={editingBook.category} onChange={handleChange}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input type="number" name="quantity" className="form-control" value={editingBook.quantity} onChange={handleChange} min={1} />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" rows={3} value={editingBook.description} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Cover Image</label>
              {editingBook.coverImagePath && (
                <img src={`http://localhost:5275${editingBook.coverImagePath}`} alt={editingBook.title} style={{ width: "100px", height: "130px", objectFit: "cover" }} />
              )}
            </div>

            <div className="d-flex justify-content-end">
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingBook(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewBook && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div className="card p-4" style={{ width: "500px", maxHeight: "90%", overflowY: "auto" }}>
            <h5 className="mb-3">{viewBook.title}</h5>
            <p><strong>Author:</strong> {viewBook.author}</p>
            <p><strong>ISBN:</strong> {viewBook.isbn}</p>
            <p><strong>Publisher:</strong> {viewBook.publisher}</p>
            <p><strong>Category:</strong> {viewBook.category}</p>
            <p><strong>Quantity:</strong> {viewBook.quantity}</p>
            <p><strong>Description:</strong> {viewBook.description}</p>
            {viewBook.coverImagePath && <img src={`http://localhost:5275${viewBook.coverImagePath}`} alt={viewBook.title} style={{ width: "100px", height: "130px", objectFit: "cover" }} />}
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-secondary" onClick={() => setViewBook(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Publisher</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Cover</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No books found.</td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.title}</td>
                  <td style={{ maxWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.author}</td>
                  <td style={{ maxWidth: "100px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.isbn}</td>
                  <td style={{ maxWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.publisher}</td>
                  <td style={{ maxWidth: "100px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.category}</td>
                  <td>{book.quantity}</td>
                  <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.description}</td>
                  <td>
                    {book.coverImagePath ? <img src={`http://localhost:5275${book.coverImagePath}`} alt={book.title} style={{ width: "60px", height: "80px", objectFit: "cover" }} /> : "N/A"}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(book)}>Edit</button>
                    <button className="btn btn-sm btn-info" onClick={() => handleViewClick(book)}>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ViewDonorBooks;
