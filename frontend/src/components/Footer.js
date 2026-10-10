import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row gy-4 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
              <i className="bi bi-calendar-event-fill text-primary fs-4 me-2"></i>
              <span className="text-white fw-bold fs-5">EventHub</span>
            </div>
            <p className="small mb-0 text-muted">
              Professional Event Management & QR-Verified Registration System. Built for technical training with React, Spring Boot, and MySQL.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small mb-2">
              <Link to="/">Home</Link>
              <Link to="/events">Browse Events</Link>
              <Link to="/login">User Login</Link>
              <Link to="/admin/login">Admin Portal</Link>
            </div>
            <p className="small mb-0 text-muted">
              &copy; {new Date().getFullYear()} EventHub System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
