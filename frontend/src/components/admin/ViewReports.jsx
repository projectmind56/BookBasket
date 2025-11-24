import React, { useEffect, useState } from "react";

function ViewReports() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5275/api/Admin/getAllOrders");
      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();
      setOrders(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = orders;

    // Search filter
    if (search.trim() !== "") {
      result = result.filter(
        (o) =>
          o.userName?.toLowerCase().includes(search.toLowerCase()) ||
          o.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
          o.donorName?.toLowerCase().includes(search.toLowerCase()) ||
          o.category?.toLowerCase().includes(search.toLowerCase()) ||
          o.bookISBN?.toLowerCase().includes(search.toLowerCase()) ||
          o.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category dropdown filter
    if (categoryFilter !== "All") {
      result = result.filter((o) => o.category === categoryFilter);
    }

    setFiltered(result);
  }, [search, categoryFilter, orders]);

  if (loading) return <h3 className="text-center mt-5">Loading Reports...</h3>;
  if (error) return <h3 className="text-center text-danger mt-5">{error}</h3>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">📘 All Orders Report</h2>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Username, Book Title, Donor, Category, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3 mb-2">
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="E-Book">E-Book</option>
            <option value="Biography">Biography</option>
            <option value="Science">Science</option>
            <option value="Story">Story</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Order Date</th>

              <th>User</th>
              <th>Email</th>
              <th>Phone</th>

              <th>Donor</th>
              <th>Donor Email</th>

              <th>Book Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Publisher</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center text-danger">
                  No matching records found
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.category}</td>
                  <td>{o.quantity}</td>
                  <td>{new Date(o.orderDate).toLocaleString()}</td>

                  <td>{o.userName}</td>
                  <td>{o.email}</td>
                  <td>{o.phone}</td>

                  <td>{o.donorName}</td>
                  <td>{o.donorEmail}</td>

                  <td>{o.bookTitle}</td>
                  <td>{o.bookAuthor}</td>
                  <td>{o.bookISBN}</td>
                  <td>{o.bookPublisher}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewReports;
