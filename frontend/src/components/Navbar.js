import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-calendar-event-fill brand-icon"></i>
          <span>EventHub</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                <i className="bi bi-house-door me-1"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/events">
                <i className="bi bi-calendar3 me-1"></i>Browse Events
              </NavLink>
            </li>
            {isAuthenticated && !isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-registrations">
                  <i className="bi bi-ticket-perforated me-1"></i>My Registrations
                </NavLink>
              </li>
            )}
            {isAuthenticated && isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-info fw-semibold"
                  href="#adminMenu"
                  id="adminDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-shield-lock-fill me-1"></i>Admin Portal
                </a>
                <ul className="dropdown-menu shadow border-0" aria-labelledby="adminDropdown">
                  <li>
                    <Link className="dropdown-item py-2" to="/admin/dashboard">
                      <i className="bi bi-speedometer2 me-2 text-primary"></i>Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/admin/events">
                      <i className="bi bi-calendar-check me-2 text-primary"></i>Manage Events
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/admin/registrations">
                      <i className="bi bi-card-checklist me-2 text-primary"></i>Manage Registrations
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/admin/participants">
                      <i className="bi bi-people me-2 text-primary"></i>Manage Participants
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/admin/attendance">
                      <i className="bi bi-qr-code-scan me-2 text-success"></i>QR Attendance Scanner
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/admin/reports">
                      <i className="bi bi-bar-chart-line me-2 text-warning"></i>Attendance Reports
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            <a
              href="/EventManagementSystem.zip"
              download="EventManagementSystem.zip"
              className="btn btn-warning btn-sm px-3 rounded-pill fw-bold text-dark"
              title="Download Full Project ZIP"
            >
              <i className="bi bi-cloud-arrow-down-fill me-1"></i>Download ZIP
            </a>
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-none d-md-flex flex-column text-end">
                  <span className="text-white small fw-bold">{user?.name}</span>
                  <span className="user-badge align-self-end">{user?.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm px-3 rounded-pill"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 rounded-pill">
                  Register
                </Link>
                <Link to="/admin/login" className="btn btn-link text-light btn-sm text-decoration-none">
                  Admin <i className="bi bi-lock-fill"></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
