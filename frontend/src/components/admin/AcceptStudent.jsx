import React, { useEffect, useState } from "react";

function AcceptStudent() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]); // filtered list
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5275/api/Admin/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
      setFiltered(data); // set filtered initially
    } catch (err) {
      console.error(err);
      alert("Failed to load students.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Live Search Filter
  useEffect(() => {
    const searchLower = search.toLowerCase();

    const result = students.filter((s) =>
      s.userName.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.collegeName?.toLowerCase().includes(searchLower) ||
      s.universityName?.toLowerCase().includes(searchLower) ||
      s.studentRollNo?.toString().includes(searchLower) ||
      s.aadharNo?.toString().includes(searchLower)
    );

    setFiltered(result);
  }, [search, students]);

  // Accept / Reject
  const updateStatus = async (userId, status) => {
    setActionLoading(userId);

    try {
      if (status === "accepted") {
        const res = await fetch(`http://localhost:5275/api/Admin/approve/${userId}`, {
          method: "PUT",
        });
        if (!res.ok) throw new Error("Failed to accept student");
      } else if (status === "rejected") {
        const res = await fetch(`http://localhost:5275/api/Admin/reject/${userId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to reject student");
      }

      await fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
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
      <h2 className="mb-4 text-primary">Student Requests</h2>

      {/* 🔍 Search Box */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, email, college, university, roll no, aadhar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive" style={{ maxHeight: "450px", overflowY: "auto" }}>
        <table className="table table-bordered table-hover">
          <thead className="table-dark" style={{ position: "sticky", top: 0, zIndex: 2 }}>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>College</th>
              <th>University</th>
              <th>Roll No</th>
              <th>Aadhar No</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No matching students found
                </td>
              </tr>
            ) : (
              filtered.map((s, index) => (
                <tr key={s.userId}>
                  <td>{index + 1}</td>
                  <td>{s.userName}</td>
                  <td>{s.phone}</td>
                  <td>{s.email}</td>
                  <td>{s?.collegeName}</td>
                  <td>{s?.universityName}</td>
                  <td>{s?.studentRollNo}</td>
                  <td>{s?.aadharNo}</td>

                  <td>
                    {s.status === "accepted" && (
                      <span className="badge bg-success">Accepted</span>
                    )}
                    {s.status === "rejected" && (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                    {s.status === "pending" && (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </td>

                  <td>
                    {s.status === "pending" ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-success btn-sm"
                          disabled={actionLoading === s.userId}
                          onClick={() => updateStatus(s.userId, "accepted")}
                        >
                          {actionLoading === s.userId ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            "Accept"
                          )}
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={actionLoading === s.userId}
                          onClick={() => updateStatus(s.userId, "rejected")}
                        >
                          {actionLoading === s.userId ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            "Reject"
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`btn btn-sm ${
                          s.status === "accepted" ? "btn-success" : "btn-danger"
                        }`}
                        disabled
                      >
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AcceptStudent;
