import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* SIDEBAR */}
        <div className="col-2 bg-primary  p-4">
          <h3 className="mb-4 text-white">Admin Panel</h3>

          <ul className="nav flex-column gap-2">

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  "nav-link text-white " + (isActive ? "fw-bold text-primary rounded px-2" : "")
                }
                to="accept-student"
                end
              >
                Accept Student
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  "nav-link text-white " + (isActive ? "fw-bold text-primary rounded px-2" : "")
                }
                to="view-reports"
              >
                View Reports
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  "nav-link text-white " + (isActive ? "fw-bold text-primary rounded px-2" : "")
                }
                to="view-donors"
              >
                View Donors
              </NavLink>
            </li>

          </ul>
        </div>

        {/* RIGHT CONTENT */}
        <div className="col-9 p-4 bg-light">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
