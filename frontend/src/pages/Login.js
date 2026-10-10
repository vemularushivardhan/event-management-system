import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

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
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const data = await login(formData.email, formData.password);
      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/events' : from);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillUser = () => {
    setFormData({
      email: 'alice.johnson@example.com',
      password: 'Password@123',
    });
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-navy text-white text-center py-4 border-0">
              <i className="bi bi-person-circle fs-1 text-primary d-block mb-2"></i>
              <h4 className="fw-bold mb-1">Welcome Back</h4>
              <p className="text-light small mb-0 opacity-75">Sign in to your EventHub account</p>
            </div>

            <div className="card-body p-4 p-lg-5">
              <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-navy mb-0">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">
                      <i className="bi bi-lock"></i>
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
                  className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Technical Training Quick-Fill Helper */}
              <div className="p-3 bg-light rounded-3 border border-secondary-subtle mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-bold text-navy">
                    <i className="bi bi-info-circle me-1 text-primary"></i>Demo Credentials
                  </span>
                  <button
                    type="button"
                    onClick={handleQuickFillUser}
                    className="btn btn-outline-primary btn-sm py-0 px-2"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Auto-Fill User
                  </button>
                </div>
                <div className="small text-muted" style={{ fontSize: '0.8rem' }}>
                  User: <code>alice.johnson@example.com</code> / <code>Password@123</code>
                </div>
              </div>

              <div className="text-center small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                  Create an account
                </Link>
              </div>

              <div className="text-center mt-3 pt-3 border-top border-secondary-subtle small">
                Are you an administrator?{' '}
                <Link to="/admin/login" className="fw-bold text-navy text-decoration-none">
                  Admin Login Portal <i className="bi bi-arrow-right-short"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
