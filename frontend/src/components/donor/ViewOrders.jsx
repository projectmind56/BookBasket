import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Decode donor ID from token
  const getDonorId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const decoded = jwtDecode(token);
      return decoded?.nameid || null; // nameid = donorId
    } catch (err) {
      console.error("Token decode error:", err);
      return null;
    }
  };

  const fetchOrders = async () => {
    const donorId = getDonorId();
    if (!donorId) {
      alert("Invalid or missing token.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5275/api/Donor/getAllOrders/${donorId}`
      );

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Search Filter
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      orders.filter((o) =>
        [
          o.bookTitle,
          o.bookAuthor,
          o.userName,
          o.category,
          o.bookISBN,
          o.bookPublisher,
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      )
    );
  }, [search, orders]);

  if (loading)
    return <h4 className="text-center mt-4">Loading Orders...</h4>;

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">My Donated Book Orders</h2>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Book, User, Category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Publisher</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>College</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center text-danger">
                  No Orders Found
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.bookTitle}</td>
                  <td>{o.bookAuthor}</td>
                  <td>{o.bookISBN}</td>
                  <td>{o.bookPublisher}</td>
                  <td>{o.category}</td>
                  <td>{o.quantity}</td>
                  <td>{new Date(o.orderDate).toLocaleString()}</td>

                  <td>{o.userName}</td>
                  <td>{o.email}</td>
                  <td>{o.phone}</td>
                  <td>{o.collegeName || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewOrders;
