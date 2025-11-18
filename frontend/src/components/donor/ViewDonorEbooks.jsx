import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ViewDonorEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewEbook, setViewEbook] = useState(null);
  const [search, setSearch] = useState("");

  // Get DonorId from token
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

  const fetchEbooks = async () => {
    const donorId = getDonorId();
    if (!donorId) {
      toast.error("Donor not logged in!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5275/api/Donor/getEBooksByDonor/${donorId}`);
      if (!res.ok) throw new Error("Failed to fetch ebooks");

      const data = await res.json();
      setEbooks(data);
      setFilteredEbooks(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = ebooks.filter((ebook) =>
      [ebook.title, ebook.author, ebook.isbn, ebook.publisher, ebook.category]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredEbooks(filtered);
  }, [search, ebooks]);

  if (loading) return <div className="text-center mt-5">Loading e-books...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">My Donated E-Books</h2>

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

      {/* PDF Overview Modal */}
      {viewEbook && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            className="card p-3"
            style={{
              width: "80%",
              height: "90%",
              overflow: "hidden",
            }}
          >
            <h5 className="mb-3">{viewEbook.title} — Overview</h5>

            <iframe
              src={`http://localhost:5275${viewEbook.filePath}`}
              title="PDF Preview"
              style={{ width: "100%", height: "85%" }}
            ></iframe>

            <div className="d-flex justify-content-end mt-2">
              <button className="btn btn-secondary" onClick={() => setViewEbook(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EBooks Table */}
      <div style={{ maxHeight: "500px", overflowY: "auto" }}>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Publisher</th>
              <th>Category</th>
              <th>Description</th>
              <th>Downloads</th>
              <th>Overview</th>
            </tr>
          </thead>

          <tbody>
            {filteredEbooks.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No e-books found.</td>
              </tr>
            ) : (
              filteredEbooks.map((ebook) => (
                <tr key={ebook.id}>
                  <td style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ebook.title}
                  </td>

                  <td style={{ maxWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ebook.author}
                  </td>

                  <td style={{ maxWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ebook.isbn}
                  </td>

                  <td style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ebook.publisher}
                  </td>

                  <td>{ebook.category}</td>

                  <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ebook.description}
                  </td>

                  <td>{ebook.downloadCount}</td>

                  <td>
                    <button className="btn btn-sm btn-info" onClick={() => setViewEbook(ebook)}>
                      Overview
                    </button>
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

export default ViewDonorEbooks;
