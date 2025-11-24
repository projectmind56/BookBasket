import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* SIDEBAR */}
        <div className="col-2 bg-primary p-4 d-flex flex-column justify-content-between">

          <div>
            <h3 className="mb-4 text-white">Student Panel</h3>

            <ul className="nav flex-column gap-2">

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    "nav-link text-white " +
                    (isActive ? "fw-bold text-primary rounded px-2" : "")
                  }
                  to="view-books"
                  end
                >
                  View Books
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    "nav-link text-white " +
                    (isActive ? "fw-bold text-primary rounded px-2" : "")
                  }
                  to="view-e-books"
                  end
                >
                  View E-Books
                </NavLink>
              </li>

                            <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    "nav-link text-white " +
                    (isActive ? "fw-bold text-primary rounded px-2" : "")
                  }
                  to="my-orders"
                  end
                >
                  My Orders
                </NavLink>
              </li>

            </ul>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            className="btn btn-outline-light mt-4"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>

        </div>

        {/* RIGHT CONTENT */}
        <div className="col-10 p-4 bg-light">
          <Outlet />
        </div>
      </div>

      {/* LOGOUT CONFIRMATION POPUP */}
      {showLogoutModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 9999 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: "350px" }}>
            <h5 className="mb-3">Confirm Logout</h5>
            <p>Are you sure you want to logout?</p>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button className="btn btn-danger" onClick={handleLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StudentDashboard;
