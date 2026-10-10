import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        setError('');
        const [reportsData, statsData] = await Promise.all([
          adminService.getAttendanceReports(),
          adminService.getDashboardStats(),
        ]);
        setReports(reportsData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to fetch attendance reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  return (
    <AdminLayout
      title="Attendance & Analytics Reports"
      subtitle="Performance statistics, capacity occupancy rates, and verification metrics"
    >
      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner text="Compiling attendance reports..." />
      ) : (
        <>
          {/* Key Metric Highlights */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
                <div className="text-muted small fw-bold text-uppercase mb-1">Total Bookings</div>
                <h3 className="fw-bold text-navy mb-0">{stats?.totalRegisteredParticipants || 0}</h3>
                <span className="small text-muted mt-1">Confirmed attendees</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
                <div className="text-muted small fw-bold text-uppercase mb-1">Check-Ins Verified</div>
                <h3 className="fw-bold text-success mb-0">{stats?.totalAttendance || 0}</h3>
                <span className="small text-muted mt-1">Scanned QR passes</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
                <div className="text-muted small fw-bold text-uppercase mb-1">Overall Check-In Rate</div>
                <h3 className="fw-bold text-primary mb-0">{stats?.attendanceRatePercentage || 0}%</h3>
                <span className="small text-muted mt-1">Turnout ratio</span>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white text-center">
                <div className="text-muted small fw-bold text-uppercase mb-1">Hosted Events</div>
                <h3 className="fw-bold text-navy mb-0">{stats?.totalEvents || 0}</h3>
                <span className="small text-muted mt-1">{stats?.upcomingEvents || 0} upcoming</span>
              </div>
            </div>
          </div>

          {/* Event Breakdown Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-header bg-transparent py-3 px-4 border-bottom border-secondary-subtle">
              <h6 className="fw-bold text-navy mb-0">Event Performance & Turnout Breakdown</h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-custom table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Capacity</th>
                      <th>Registrations</th>
                      <th>Occupancy %</th>
                      <th>Attendance</th>
                      <th className="text-end">Turnout Rate %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted small">
                          No event reports available.
                        </td>
                      </tr>
                    ) : (
                      reports.map((rep) => (
                        <tr key={rep.eventId}>
                          <td>
                            <div className="fw-bold text-navy">{rep.eventName}</div>
                            <div className="text-muted small">Event #{rep.eventId}</div>
                          </td>
                          <td className="small text-navy">{rep.eventDate}</td>
                          <td>
                            <span className="small fw-semibold">{rep.capacity} seats</span>
                          </td>
                          <td>
                            <span className="small fw-bold text-navy">{rep.totalRegistrations}</span>
                          </td>
                          <td style={{ minWidth: '150px' }}>
                            <div className="d-flex justify-content-between small text-muted mb-1">
                              <span>{rep.occupancyPercentage}%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${Math.min(100, rep.occupancyPercentage)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <span className="small fw-bold text-success">{rep.totalAttendance}</span>
                          </td>
                          <td className="text-end" style={{ minWidth: '150px' }}>
                            <div className="d-flex justify-content-between small text-muted mb-1">
                              <span></span>
                              <span className="fw-semibold text-navy">{rep.attendanceRatePercentage}%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${Math.min(100, rep.attendanceRatePercentage)}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminReports;
