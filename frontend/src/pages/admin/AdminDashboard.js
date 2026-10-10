import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import eventService from '../../services/eventService';
import AdminLayout from '../../components/AdminLayout';
import DashboardCard from '../../components/DashboardCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const [statsData, eventsData, regsData] = await Promise.all([
          adminService.getDashboardStats(),
          eventService.getAllEvents(),
          adminService.getAllRegistrations(),
        ]);

        setStats(statsData);
        setRecentEvents(eventsData.slice(0, 5));
        setRecentRegistrations(regsData.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard metrics from backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout
      title="Executive Dashboard"
      subtitle="Overview of events, attendance, registrations, and real-time operations"
      actionButton={
        <div className="d-flex gap-2">
          <Link to="/admin/attendance" className="btn btn-outline-primary btn-sm fw-semibold">
            <i className="bi bi-qr-code-scan me-1"></i>QR Scanner
          </Link>
          <Link to="/admin/events/create" className="btn btn-primary btn-sm fw-semibold">
            <i className="bi bi-plus-lg me-1"></i>Create Event
          </Link>
        </div>
      }
    >
      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner text="Computing dashboard metrics..." />
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="row g-4 mb-4">
            <div className="col-sm-6 col-xl-3">
              <DashboardCard
                title="Total Events"
                value={stats?.totalEvents || 0}
                icon="bi-calendar-event"
                color="primary"
                subtitle={`${stats?.upcomingEvents || 0} upcoming`}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <DashboardCard
                title="Registered Users"
                value={stats?.totalRegisteredParticipants || 0}
                icon="bi-people"
                color="navy"
                subtitle="Active participants"
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <DashboardCard
                title="Total Attendance"
                value={stats?.totalAttendance || 0}
                icon="bi-patch-check"
                color="success"
                subtitle="Verified via QR token"
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <DashboardCard
                title="Check-In Rate"
                value={`${stats?.attendanceRatePercentage || 0}%`}
                icon="bi-pie-chart"
                color="warning"
                subtitle="Attendance percentage"
              />
            </div>
          </div>

          <div className="row g-4">
            {/* Recent Events Table */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
                <div className="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center border-bottom border-secondary-subtle">
                  <h6 className="fw-bold text-navy mb-0">Active Events</h6>
                  <Link to="/admin/events" className="small text-primary fw-semibold text-decoration-none">
                    View All ({stats?.totalEvents})
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-custom table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Event</th>
                          <th>Date</th>
                          <th>Bookings</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvents.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center py-4 text-muted small">
                              No events found.
                            </td>
                          </tr>
                        ) : (
                          recentEvents.map((evt) => (
                            <tr key={evt.id}>
                              <td>
                                <div className="fw-bold text-navy text-truncate" style={{ maxWidth: '180px' }}>
                                  {evt.eventName}
                                </div>
                                <div className="text-muted small text-truncate" style={{ maxWidth: '180px' }}>
                                  {evt.venue}
                                </div>
                              </td>
                              <td className="small">{evt.eventDate}</td>
                              <td>
                                <span className="small fw-semibold">
                                  {evt.capacity - evt.availableSeats} / {evt.capacity}
                                </span>
                              </td>
                              <td className="text-end">
                                <Link to={`/admin/events/edit/${evt.id}`} className="btn btn-sm btn-light border py-1 px-2">
                                  <i className="bi bi-pencil"></i>
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
                <div className="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center border-bottom border-secondary-subtle">
                  <h6 className="fw-bold text-navy mb-0">Recent Registrations</h6>
                  <Link to="/admin/registrations" className="small text-primary fw-semibold text-decoration-none">
                    Manage All
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-custom table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Participant</th>
                          <th>Event</th>
                          <th>Status</th>
                          <th className="text-end">Attendance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center py-4 text-muted small">
                              No registrations recorded yet.
                            </td>
                          </tr>
                        ) : (
                          recentRegistrations.map((reg) => (
                            <tr key={reg.id}>
                              <td>
                                <div className="fw-bold text-navy">{reg.userName}</div>
                                <div className="text-muted small">{reg.userEmail}</div>
                              </td>
                              <td className="small text-truncate" style={{ maxWidth: '140px' }}>
                                {reg.eventName}
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    reg.registrationStatus === 'CONFIRMED'
                                      ? 'badge-confirmed'
                                      : 'badge-cancelled'
                                  }`}
                                  style={{ fontSize: '0.7rem' }}
                                >
                                  {reg.registrationStatus}
                                </span>
                              </td>
                              <td className="text-end">
                                <span
                                  className={`badge ${
                                    reg.attendanceStatus === 'ATTENDED'
                                      ? 'badge-attended'
                                      : 'badge-registered'
                                  }`}
                                  style={{ fontSize: '0.7rem' }}
                                >
                                  {reg.attendanceStatus}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
