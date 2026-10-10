import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import adminService from '../../services/adminService';
import eventService from '../../services/eventService';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const AdminRegistrations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedEventId, setSelectedEventId] = useState(searchParams.get('eventId') || '');
  const [regStatus, setRegStatus] = useState(searchParams.get('regStatus') || '');
  const [attStatus, setAttStatus] = useState(searchParams.get('attStatus') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchDropdownEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (e) {
        // silent fallback
      }
    };
    fetchDropdownEvents();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (selectedEventId) params.eventId = selectedEventId;
      if (regStatus) params.registrationStatus = regStatus;
      if (attStatus) params.attendanceStatus = attStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await adminService.getAllRegistrations(params);
      setRegistrations(data);
    } catch (err) {
      setError('Failed to fetch registrations from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    // Sync to URL
    const nextParams = {};
    if (selectedEventId) nextParams.eventId = selectedEventId;
    if (regStatus) nextParams.regStatus = regStatus;
    if (attStatus) nextParams.attStatus = attStatus;
    if (searchQuery.trim()) nextParams.search = searchQuery.trim();
    setSearchParams(nextParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId, regStatus, attStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleResetFilters = () => {
    setSelectedEventId('');
    setRegStatus('');
    setAttStatus('');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <AdminLayout
      title="Manage Registrations"
      subtitle="Comprehensive list of attendee bookings, ticket statuses, and attendance check-ins"
    >
      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-3">
            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">Filter by Event</label>
              <select
                className="form-select"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                <option value="">All Events</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.eventName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <label className="form-label small fw-semibold text-muted mb-1">Pass Status</label>
              <select
                className="form-select"
                value={regStatus}
                onChange={(e) => setRegStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <label className="form-label small fw-semibold text-muted mb-1">Attendance</label>
              <select
                className="form-select"
                value={attStatus}
                onChange={(e) => setAttStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="REGISTERED">Registered</option>
                <option value="ATTENDED">Attended</option>
              </select>
            </div>

            <div className="col-lg-3 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">Search Participant</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name, email, QR token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-light border w-100 fw-semibold"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving registrations..." />
      ) : registrations.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-secondary-subtle">
          <i className="bi bi-card-checklist fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-navy">No Registrations Match Filters</h5>
          <p className="text-muted small mb-3">Try adjusting your filters or search keywords.</p>
          <button className="btn btn-outline-primary btn-sm px-4 rounded-pill" onClick={handleResetFilters}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>Date Booked</th>
                  <th>QR Token</th>
                  <th>Pass Status</th>
                  <th>Attendance</th>
                  <th className="text-end">Check-In Time</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <div className="fw-bold text-navy">{reg.userName}</div>
                      <div className="text-muted small">{reg.userEmail} &bull; {reg.userPhone}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-navy text-truncate" style={{ maxWidth: '200px' }}>
                        {reg.eventName}
                      </div>
                      <div className="text-muted small">{reg.eventDate}</div>
                    </td>
                    <td className="small text-muted">
                      {new Date(reg.registrationDate).toLocaleDateString()}
                    </td>
                    <td>
                      <code className="small bg-light px-2 py-1 rounded border">{reg.qrToken}</code>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          reg.registrationStatus === 'CONFIRMED'
                            ? 'badge-confirmed'
                            : 'badge-cancelled'
                        }`}
                      >
                        {reg.registrationStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          reg.attendanceStatus === 'ATTENDED'
                            ? 'badge-attended'
                            : 'badge-registered'
                        }`}
                      >
                        {reg.attendanceStatus}
                      </span>
                    </td>
                    <td className="text-end small">
                      {reg.checkInTime ? (
                        <span className="text-success fw-semibold">
                          <i className="bi bi-check2-circle me-1"></i>
                          {new Date(reg.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
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

export default AdminRegistrations;
