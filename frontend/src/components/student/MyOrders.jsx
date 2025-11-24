import React, { useEffect, useState } from 'react';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5275/api/Student/getMyOrders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <h4 className="text-center mt-5">Loading orders...</h4>;
  if (error) return <h4 className="text-center mt-5 text-danger">{error}</h4>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">My Orders</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Donor Name</th>
              <th>Donor Email</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Publisher</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrders;
