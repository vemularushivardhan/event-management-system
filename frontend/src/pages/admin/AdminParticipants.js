import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const AdminParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchParticipants = async (query = '') => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllParticipants(query);
      setParticipants(data);
    } catch (err) {
      setError('Failed to fetch participants from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchParticipants(search);
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchParticipants('');
  };

  return (
    <AdminLayout
      title="Manage Participants"
      subtitle="Directory of registered attendees, contact info, and booking history"
    >
      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <form onSubmit={handleSearchSubmit}>
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search participants by full name or email address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="btn btn-light border"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
            <button type="submit" className="btn btn-primary px-4">
              Search
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Searching participants database..." />
      ) : participants.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-secondary-subtle">
          <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-navy">No Participants Found</h5>
          <p className="text-muted small mb-0">No attendee accounts match your search query.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Participant Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Registered Events</th>
                  <th>Account Created</th>
                  <th className="text-end">View Bookings</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center me-3"
                          style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-navy">{user.name}</div>
                          <div className="text-muted small">User ID #{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-navy text-decoration-none small">
                        {user.email}
                      </a>
                    </td>
                    <td>
                      <span className="small text-muted">{user.phone}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        {user.registeredEventsCount} Events
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/admin/registrations?search=${encodeURIComponent(user.email)}`}
                        className="btn btn-outline-primary btn-sm px-3 fw-semibold"
                        title="View bookings for this user"
                      >
                        <i className="bi bi-card-checklist me-1"></i>Registrations
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminParticipants;
