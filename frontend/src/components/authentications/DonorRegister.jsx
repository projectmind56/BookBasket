import React, { useState } from "react";
import { toast } from "react-toastify";

function DonorRegister() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "donor",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.userName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      return toast.error("All fields are required!");
    }

    if (!validateEmail(formData.email)) {
      return toast.error("Invalid email format.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (formData.phone.length < 10) {
      return toast.error("Phone number must be at least 10 digits.");
    }

    if (!formData.password || formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5275/api/Student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      toast.success("Registered successfully!");
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "donor",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT SIDE – About Donors */}
        <div className="col-md-5 d-flex flex-column justify-content-center align-items-start bg-primary text-white p-5">
          <h1 className="fw-bold">🤝 Welcome Donors!</h1>
          <p className="fs-5 mt-3">
            Join our donor community and help make a difference.
            Register now to start your journey!
          </p>
        </div>

        {/* RIGHT SIDE – Donor Register Form */}
        <div className="col-md-7 d-flex justify-content-center align-items-center bg-light">
          <div className="card p-4 shadow" style={{ width: "400px" }}>
            <h3 className="text-center mb-3">Donor Registration</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">User Name</label>
                <input
                  type="text"
                  name="userName"
                  className="form-control"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-success w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <p className="text-center mt-3">
              Already registered? <a href="/login">Login</a> <a href="/student-register">Student Register</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DonorRegister;
