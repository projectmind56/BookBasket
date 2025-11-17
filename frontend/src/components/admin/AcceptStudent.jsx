import React, { useEffect, useState } from "react";

function AcceptStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // main loader
  const [actionLoading, setActionLoading] = useState(null); // loader for accept/reject buttons

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5275/api/Admin/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Accept or Reject
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

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phono</th>
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
            {students.map((s, index) => (
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
                  {s.status === "accepted" && (
                    <button className="btn btn-success btn-sm" disabled>
                      Accepted
                    </button>
                  )}

                  {s.status === "rejected" && (
                    <button className="btn btn-danger btn-sm" disabled>
                      Rejected
                    </button>
                  )}

                  {s.status === "pending" && (
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AcceptStudent;
