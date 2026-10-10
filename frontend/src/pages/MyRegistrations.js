import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import registrationService from '../services/registrationService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import ConfirmationModal from '../components/ConfirmationModal';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedReg, setSelectedReg] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError('Failed to fetch your registrations. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelClick = (reg) => {
    setSelectedReg(reg);
    setCancellingId(reg.id);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;

    try {
      setError('');
      await registrationService.cancelRegistration(cancellingId);
      setSuccess('Registration cancelled successfully. Your seat has been released.');
      setCancellingId(null);
      setSelectedReg(null);
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel registration.');
      setCancellingId(null);
      setSelectedReg(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold text-navy mb-1">My Registrations</h2>
          <p className="text-muted small mb-0">View your active passes, attendance status, and event tickets</p>
        </div>
        <Link to="/events" className="btn btn-outline-primary btn-sm mt-3 mt-md-0 fw-semibold">
          <i className="bi bi-search me-1"></i>Explore More Events
        </Link>
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
      <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />

      {loading ? (
        <LoadingSpinner text="Retrieving your registration records..." />
      ) : registrations.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-secondary-subtle">
          <i className="bi bi-ticket-perforated fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-navy">No Registered Events Found</h5>
          <p className="text-muted small mb-3">You haven't registered for any events yet. Check out our upcoming summits!</p>
          <Link to="/events" className="btn btn-primary btn-sm px-4 rounded-pill">
            Browse Upcoming Events
          </Link>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Pass Status</th>
                  <th>Attendance</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => {
                  const isCancelled = reg.registrationStatus === 'CANCELLED';
                  const isAttended = reg.attendanceStatus === 'ATTENDED';

                  return (
                    <tr key={reg.id}>
                      <td>
                        <div className="fw-bold text-navy">{reg.eventName}</div>
                        <div className="text-muted small">Token: <code>{reg.qrToken}</code></div>
                      </td>
                      <td>
                        <div className="fw-semibold text-navy">{reg.eventDate}</div>
                        <div className="text-muted small">{reg.eventTime}</div>
                      </td>
                      <td>
                        <span className="small text-muted">{reg.venue}</span>
                      </td>
                      <td>
                        {isCancelled ? (
                          <span className="badge badge-pill-status badge-cancelled">
                            <i className="bi bi-x-circle me-1"></i>Cancelled
                          </span>
                        ) : (
                          <span className="badge badge-pill-status badge-confirmed">
                            <i className="bi bi-check-circle me-1"></i>Confirmed
                          </span>
                        )}
                      </td>
                      <td>
                        {isAttended ? (
                          <span className="badge badge-pill-status badge-attended">
                            <i className="bi bi-patch-check-fill me-1"></i>Attended
                          </span>
                        ) : (
                          <span className="badge badge-pill-status badge-registered">
                            <i className="bi bi-hourglass-split me-1"></i>Registered
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/my-registrations/${reg.id}`}
                            className="btn btn-outline-primary btn-sm px-3 fw-semibold"
                            title="View and download QR Code"
                          >
                            <i className="bi bi-qr-code me-1"></i>QR Pass
                          </Link>

                          {!isCancelled && !isAttended && (
                            <button
                              onClick={() => handleCancelClick(reg)}
                              className="btn btn-outline-danger btn-sm px-2"
                              title="Cancel this registration"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <ConfirmationModal
        show={!!cancellingId}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration for "${selectedReg?.eventName}"? Your reserved seat will be immediately released.`}
        confirmText="Yes, Cancel Registration"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancellingId(null);
          setSelectedReg(null);
        }}
      />
    </div>
  );
};

export default MyRegistrations;
