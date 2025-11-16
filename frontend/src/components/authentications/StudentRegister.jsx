import React, { useState } from "react";
import { toast } from "react-toastify";

function StudentRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    studentRollNo: "",
    collegeName: "",
    universityName: "",
    aadharNo: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleNext = (e) => {
    e.preventDefault();

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

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.aadharNo.length !== 12 || !/^\d+$/.test(formData.aadharNo)) {
      return toast.error("Aadhar number must be exactly 12 digits.");
    }

    if (!formData.collegeName || !formData.universityName || !formData.studentRollNo) {
      return toast.error("All fields are required.");
    }



    setLoading(true);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5275/api/Student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          studentRollNo: formData.studentRollNo,
          collegeName: formData.collegeName,
          universityName: formData.universityName,
          aadharNo: formData.aadharNo,
        }),
      });

      // If response is not OK, read the error message and throw
      if (!response.ok) {
        let errorMessage = "Registration failed!";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, keep default message
        }
        throw new Error(errorMessage); // ✅ This will go to catch block
      }

      const result = await response.json();
      toast.success("Registered successfully!");

      // Reset form
      setStep(1);
      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        studentRollNo: "",
        collegeName: "",
        universityName: "",
        aadharNo: "",
      });

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT SIDE – About Books */}
        <div className="col-md-5 d-flex flex-column justify-content-center align-items-start bg-primary text-white p-5">
          <h1 className="fw-bold">📚 Welcome to BookStore!</h1>
          <p className="fs-5 mt-3">
            Discover millions of books across genres.
            Join our community and start building your personal library today.
          </p>
        </div>

        {/* RIGHT SIDE – Register Form */}
        <div className="col-md-7 d-flex justify-content-center align-items-center bg-light">
          <div className="card p-4 shadow" style={{ width: "400px" }}>

            <h3 className="text-center mb-3">Create Account</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleNext}>
                <div className="mb-3">
                  <label className="form-label">User Name</label>
                  <input
                    type="text"
                    name="userName"
                    className="form-control"
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
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-secondary" disabled>
                    Back
                  </button>
                  <button className="btn btn-primary">Next →</button>
                </div>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Student Roll No</label>
                  <input
                    type="text"
                    name="studentRollNo"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">College Name</label>
                  <input
                    type="text"
                    name="collegeName"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">University Name</label>
                  <input
                    type="text"
                    name="universityName"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Aadhar No</label>
                  <input
                    type="text"
                    name="aadharNo"
                    className="form-control"
                    onChange={handleChange}
                    maxLength="12"
                    required
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-secondary" onClick={handleBack}>
                    ← Back
                  </button>
                  <button className="btn btn-success" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>

                </div>
              </form>
            )}

            <p className="text-center mt-3">
              Already have an account? <a href="/login">Login</a> <a href="/donaor-register">Donor Register</a>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentRegister;
