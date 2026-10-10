import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from '../../components/AlertMessage';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please provide administrator email and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(formData.email, formData.password);
      if (data.role !== 'ADMIN') {
        setError('Access denied: You do not have administrator permissions.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please ensure Spring Boot is running on http://localhost:8080.');
      } else {
        setError(err.response?.data?.message || 'Invalid administrator credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setFormData({
      email: 'admin@eventmanagement.com',
      password: 'Admin@123',
    });
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-navy text-white text-center py-4 border-0">
              <i className="bi bi-shield-lock-fill fs-1 text-warning d-block mb-2"></i>
              <h4 className="fw-bold mb-1">Admin Portal</h4>
              <p className="text-light small mb-0 opacity-75">Secure Administrative Console</p>
            </div>

            <div className="card-body p-4 p-lg-5">
              <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Admin Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-shield-shaded"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="admin@eventmanagement.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-navy">Admin Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-key-fill"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-navy w-100 py-2 fw-semibold mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Authenticating Admin...
                    </span>
                  ) : (
                    'Enter Admin Console'
                  )}
                </button>
              </form>

              {/* Quick-fill button for testing */}
              <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-bold text-navy">
                    <i className="bi bi-key me-1 text-warning"></i>Default Admin Account
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickFillAdmin}
                    className="btn btn-outline-dark btn-sm py-0 px-2"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Auto-Fill Admin
                  </button>
                </div>
                <div className="small text-muted" style={{ fontSize: '0.8rem' }}>
                  Email: <code>admin@eventmanagement.com</code><br />
                  Password: <code>Admin@123</code>
                </div>
              </div>

              <div className="text-center small text-muted">
                Return to{' '}
                <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                  Standard User Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
