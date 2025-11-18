import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEBooks() {
  const [ebook, setEbook] = useState({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    category: "",
    description: "",
    EBookFile: null, // ✅ Must match backend DTO
  });

  const categories = ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Technology"];

  const getDonorIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.nameid; // Adjust this according to your token structure
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "EBookFile") {
      if (files[0] && files[0].size > 20 * 1024 * 1024) { // 20 MB limit
        toast.error("File size must be less than 20 MB");
        e.target.value = null;
        return;
      }
      setEbook({ ...ebook, EBookFile: files[0] });
    } else {
      setEbook({ ...ebook, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donorId = getDonorIdFromToken();
    if (!donorId) {
      toast.error("Donor not logged in!");
      return;
    }

    if (!ebook.EBookFile) {
      toast.warn("Please upload the e-book file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", ebook.title);
      formData.append("Author", ebook.author);
      formData.append("ISBN", ebook.isbn);
      formData.append("Publisher", ebook.publisher);
      formData.append("Category", ebook.category);
      formData.append("Description", ebook.description);
      formData.append("DonorId", donorId);
      formData.append("EBookFile", ebook.EBookFile); // Must match DTO

      const res = await fetch("http://localhost:5275/api/Donor/addEBook", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.title || "Failed to add e-book");
      }

      toast.success("E-Book added successfully!");
      setEbook({
        title: "",
        author: "",
        isbn: "",
        publisher: "",
        category: "",
        description: "",
        EBookFile: null,
      });

      // Clear the file input manually
      document.getElementById("ebookFileInput").value = null;

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Add New E-Book</h2>

      <form onSubmit={handleSubmit}>
        {/* Row 1: Title | Author | ISBN */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={ebook.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Author *</label>
            <input
              type="text"
              name="author"
              className="form-control"
              value={ebook.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">ISBN *</label>
            <input
              type="text"
              name="isbn"
              className="form-control"
              value={ebook.isbn}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 2: Publisher | Category */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Publisher</label>
            <input
              type="text"
              name="publisher"
              className="form-control"
              value={ebook.publisher}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Category *</label>
            <select
              name="category"
              className="form-select"
              value={ebook.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={ebook.description}
            onChange={handleChange}
            rows={3}
          ></textarea>
        </div>

        {/* E-Book File */}
        <div className="mb-3">
          <label className="form-label">E-Book File *</label>
          <input
            type="file"
            id="ebookFileInput"
            name="EBookFile" // ✅ Must match backend DTO
            className="form-control"
            accept=".pdf,.epub,.mobi"
            onChange={handleChange}
            required
          />
          <small className="text-muted">
            Max size: 20 MB. Allowed formats: PDF, EPUB, MOBI
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Add E-Book
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AddEBooks;
