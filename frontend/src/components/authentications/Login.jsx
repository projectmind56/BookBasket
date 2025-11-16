import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(loginData.email)) {
      return toast.error("Invalid email format.");
    }

    if (!loginData.password) {
      return toast.error("Password is required.");
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5275/api/Student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Try again.");
      }

      toast.success("Login successful!");

      // Save token
      localStorage.setItem("token", data.token);

      // Decode token
      const decoded = jwtDecode(data.token);

      console.log("Decoded Token:", decoded);

      // Extract role (ASP.NET usually places role under claims)
      const role =
        decoded.role ||
        decoded.Role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      console.log("Logged-in role:", role);

      // Redirect based on role
      switch (role) {
        case "admin":
          console.log(role);
          
          navigate("/admin-dashboard");
          break;

        case "student":
          console.log(role);

          navigate("/student-dashboard");
          break;

        case "donor":
          console.log(role);

          navigate("/donor-dashboard");
          break;

        default:
          navigate("/home");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* LEFT SIDE – Login Form */}
        <div className="col-md-7 d-flex justify-content-center align-items-center bg-light">
          <div className="card p-4 shadow" style={{ width: "450px" }}>
            <h3 className="text-center mb-3">Login</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={loginData.email}
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
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                className="btn btn-success w-100 mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center mt-3">
              Don’t have an account?{" "}
              <a href="/student-register">Student Register</a> |{" "}
              <a href="/donor-register">Donor Register</a>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-5 d-flex flex-column justify-content-center align-items-start bg-success text-white p-5">
          <h1 className="fw-bold">📘 Welcome Back!</h1>
          <p className="fs-5 mt-3">
            Dive into your personalized collection, continue reading,
            and explore more amazing books.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;