import React, { useEffect, useState } from "react";

function ViewDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true); // main loader
  const [actionLoading, setActionLoading] = useState(null); // loader for reject button

  // Fetch donors
  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5275/api/Admin/donors");
      if (!res.ok) throw new Error("Failed to fetch donors");
      const data = await res.json();
      setDonors(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load donors.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // Reject donor
  const rejectDonor = async (userId) => {
    setActionLoading(userId);

    try {
      const res = await fetch(`http://localhost:5275/api/Admin/reject/${userId}`, {
        method: "POST", // or DELETE depending on your backend
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to reject donor");

      alert("Donor rejected successfully.");
      await fetchDonors(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert("Failed to reject donor.");
    }

    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-primary">Donors List</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d, index) => (
              <tr key={d.userId}>
                <td>{index + 1}</td>
                <td>{d.userName}</td>
                <td>{d.phone}</td>
                <td>{d.email}</td>
                <td>
                  {d.status === "accepted" && (
                    <span className="badge bg-success">Accepted</span>
                  )}
                  {d.status === "rejected" && (
                    <span className="badge bg-danger">Rejected</span>
                  )}
                  {!d.status && (
                    <span className="badge bg-secondary">None</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    disabled={actionLoading === d.userId}
                    onClick={() => rejectDonor(d.userId)}
                  >
                    {actionLoading === d.userId ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Reject"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewDonors;
