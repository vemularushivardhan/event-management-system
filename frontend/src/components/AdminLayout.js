import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminLayout = ({ children, title, subtitle, actionButton }) => {
  return (
    <div className="container-fluid px-0">
      <div className="row g-0">
        {/* Admin Sidebar */}
        <div className="col-lg-2 col-md-3 admin-sidebar d-none d-md-block">
          <div className="sidebar-heading">Admin Management</div>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/events"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-calendar-event"></i>
            <span>Events</span>
          </NavLink>
          <NavLink
            to="/admin/registrations"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-card-checklist"></i>
            <span>Registrations</span>
          </NavLink>
          <NavLink
            to="/admin/participants"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-people"></i>
            <span>Participants</span>
          </NavLink>

          <div className="sidebar-heading mt-4">Verification & Analytics</div>
          <NavLink
            to="/admin/attendance"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-qr-code-scan"></i>
            <span>QR Attendance</span>
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-graph-up-arrow"></i>
            <span>Reports & Stats</span>
          </NavLink>

          <div className="sidebar-heading mt-4">Quick Actions</div>
          <NavLink
            to="/admin/events/create"
            className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Create New Event</span>
          </NavLink>
        </div>

        {/* Admin Main View */}
        <div className="col-lg-10 col-md-9 p-4 p-lg-5 bg-main">
          {/* Mobile Navigation bar for admin */}
          <div className="d-md-none mb-3 d-flex flex-wrap gap-2">
            <NavLink to="/admin/dashboard" className="btn btn-sm btn-outline-dark">Dashboard</NavLink>
            <NavLink to="/admin/events" className="btn btn-sm btn-outline-dark">Events</NavLink>
            <NavLink to="/admin/registrations" className="btn btn-sm btn-outline-dark">Registrations</NavLink>
            <NavLink to="/admin/participants" className="btn btn-sm btn-outline-dark">Participants</NavLink>
            <NavLink to="/admin/attendance" className="btn btn-sm btn-outline-dark">QR Scanner</NavLink>
            <NavLink to="/admin/reports" className="btn btn-sm btn-outline-dark">Reports</NavLink>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom border-secondary-subtle">
            <div>
              <h2 className="fw-bold text-navy mb-1">{title}</h2>
              {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
            </div>
            {actionButton && <div className="mt-3 mt-md-0">{actionButton}</div>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
