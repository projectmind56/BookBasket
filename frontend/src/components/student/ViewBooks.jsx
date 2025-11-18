import React, { useEffect, useState } from "react";

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // View Details Popup
  const [selectedBook, setSelectedBook] = useState(null);

  // Buy Now Flow
  const [orderBook, setOrderBook] = useState(null);
  const [orderQty, setOrderQty] = useState(1);
  const [paymentMode, setPaymentMode] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:5275/api/Student/getAvailableBooks");
      const data = await res.json();
      setBooks(data);
      setFiltered(data);
    } catch {
      console.error("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🔍 search filter
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      books.filter((b) =>
        [b.title, b.author, b.publisher, b.category].join(" ").toLowerCase().includes(s)
      )
    );
  }, [search, books]);

  if (loading) return <h4 className="text-center mt-5">Loading books...</h4>;

  return (
    <div className="container mt-4">

      {/* 🔥 Inline CSS */}
      <style>
        {`
          .book-card { background:#fff; border-radius:8px; overflow:hidden; transition:0.25s; cursor:pointer; }
          .book-card:hover { transform:scale(1.03); box-shadow:0 6px 15px rgba(0,0,0,0.2); }
          .book-img { width:100%; height:130px; object-fit:cover; }
          .book-desc {
            color:#555; font-size:13px;
            max-height:32px;
            overflow:hidden;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
          }
          .modal-overlay {
            position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.6); backdrop-filter:blur(3px);
            display:flex; justify-content:center; align-items:center; z-index:9999;
          }
          .modal-box {
            background:#fff; padding:20px; width:450px; border-radius:10px;
            max-height:90vh; overflow-y:auto;
            animation:fadeIn 0.3s ease;
          }
          .modal-img {
            width:100%; height:250px; object-fit:cover; border-radius:8px;
          }
          @keyframes fadeIn {
            from { opacity:0; transform:scale(0.8); }
            to { opacity:1; transform:scale(1); }
          }
        `}
      </style>

      <h2 className="text-primary mb-4">Available Books</h2>

      {/* Search Box */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search Title, Author, Publisher, Category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Grid — 5 per row */}
      <div className="row">
        {filtered.map((book) => (
          <div className="col-6 col-md-2 mb-4" key={book.id}>
            <div className="book-card shadow-sm">

              <img
                src={`http://localhost:5275${book.coverImagePath}`}
                alt=""
                className="book-img"
              />

              <div className="p-2">
                <h6 className="book-title">{book.title}</h6>
                <p className="book-author">By {book.author}</p>
                <p className="book-desc">{book.description}</p>

                <button
                  className="btn btn-primary btn-sm w-100"
                  onClick={() => setSelectedBook(book)}
                >
                  View Details
                </button>

                <button
                  className="btn btn-success btn-sm w-100 mt-2"
                  onClick={() => {
                    setOrderBook(book);
                    setOrderQty(1);
                  }}
                >
                  Buy Now
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>

      {/* ⭐ VIEW DETAILS POPUP ⭐ */}
      {selectedBook && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h3 className="text-primary">{selectedBook.title}</h3>

            <img
              src={`http://localhost:5275${selectedBook.coverImagePath}`}
              alt=""
              className="modal-img"
            />

            <div className="mt-3">
              <p><strong>Author:</strong> {selectedBook.author}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
              <p><strong>Category:</strong> {selectedBook.category}</p>
              <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
              <p><strong>Available Quantity:</strong> {selectedBook.quantity}</p>

              <p><strong>Description:</strong></p>
              <p>{selectedBook.description}</p>
            </div>

            <button
              className="btn btn-danger w-100 mt-3"
              onClick={() => setSelectedBook(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ⭐ ORDER POPUP ⭐ */}
      {orderBook && !paymentMode && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4 className="text-center text-primary">Order Book</h4>
            <hr />

            <p><strong>Book:</strong> {orderBook.title}</p>
            <p><strong>Available Quantity:</strong> {orderBook.quantity}</p>

            <label><strong>Select Quantity</strong></label>
            <input
              type="number"
              className="form-control mb-3"
              min="1"
              max={orderBook.quantity}
              value={orderQty}
              onChange={(e) => {
                const q = Number(e.target.value);
                if (q <= orderBook.quantity && q >= 1) {
                  setOrderQty(q);
                }
              }}
            />

            <button
              className="btn btn-primary w-100 mb-2"
              onClick={() => setPaymentMode(true)}
            >
              Continue to Payment
            </button>

            <button
              className="btn btn-danger w-100"
              onClick={() => setOrderBook(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ⭐ PAYMENT POPUP ⭐ */}
      {orderBook && paymentMode && !paymentSuccess && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h4 className="text-center text-success">Payment</h4>
            <hr />

            <label>Card Number</label>
            <input type="text" className="form-control mb-2" placeholder="xxxx xxxx xxxx xxxx" />

            <label>Expiry Date</label>
            <input type="text" className="form-control mb-2" placeholder="MM/YY" />

            <label>CVV</label>
            <input type="password" className="form-control mb-3" placeholder="***" maxLength="3" />

            <button
              className="btn btn-success w-100 mb-3"
              onClick={() => {
                setPaymentSuccess(true);
                setTimeout(() => {
                  setPaymentMode(false);
                  setOrderBook(null);
                  setPaymentSuccess(false);
                }, 2000);
              }}
            >
              Pay Now
            </button>

            <button
              className="btn btn-danger w-100"
              onClick={() => setPaymentMode(false)}
            >
              Back
            </button>

          </div>
        </div>
      )}

      {/* ⭐ PAYMENT SUCCESS POPUP ⭐ */}
      {paymentSuccess && (
        <div className="modal-overlay">
          <div className="modal-box text-center">
            <h3 className="text-success">Payment Successful!</h3>
            <p>Your order has been placed.</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default ViewBooks;
