import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import ConfirmationModal from '../components/ConfirmationModal';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newRegistration, setNewRegistration] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Event not found or failed to load details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmRegistration = async () => {
    setShowConfirmModal(false);
    setError('');
    setSuccess('');

    try {
      setRegistering(true);
      const reg = await registrationService.registerForEvent(id);
      setNewRegistration(reg);
      setSuccess('Registration confirmed successfully! Your digital QR pass is ready.');
      // Refresh event seat counts
      fetchEventDetails();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete registration. Please try again.';
      setError(msg);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="container py-5 text-center">
        <AlertMessage variant="danger" message={error || 'Event could not be found.'} />
        <Link to="/events" className="btn btn-primary mt-3">
          <i className="bi bi-arrow-left me-2"></i>Back to Browse Events
        </Link>
      </div>
    );
  }

  const { eventName, description, eventDate, eventTime, venue, capacity, availableSeats, isFull, isPast } = event;
  const percentageBooked = capacity > 0 ? Math.round(((capacity - availableSeats) / capacity) * 100) : 0;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/events" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i>Back to All Events
        </Link>
      </div>

      <div className="row g-4">
        {/* Left Column: Event Information */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white mb-4">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              {isFull ? (
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 fw-semibold">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>Sold Out
                </span>
              ) : (
                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-semibold">
                  <i className="bi bi-check-circle-fill me-1"></i>Open for Registration
                </span>
              )}
              {isPast && (
                <span className="badge bg-secondary px-3 py-2 fw-semibold">
                  <i className="bi bi-clock-history me-1"></i>Past Event
                </span>
              )}
            </div>

            <h1 className="fw-bold text-navy mb-3">{eventName}</h1>

            <div className="d-flex flex-wrap gap-4 py-3 border-top border-bottom border-secondary-subtle my-3 text-muted small">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar-event fs-5 text-primary me-2"></i>
                <div>
                  <div className="fw-bold text-navy">Date</div>
                  <div>
                    {new Date(eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <i className="bi bi-clock fs-5 text-primary me-2"></i>
                <div>
                  <div className="fw-bold text-navy">Time</div>
                  <div>{eventTime}</div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <i className="bi bi-geo-alt fs-5 text-primary me-2"></i>
                <div>
                  <div className="fw-bold text-navy">Venue</div>
                  <div>{venue}</div>
                </div>
              </div>
            </div>

            <h5 className="fw-bold text-navy mt-4 mb-2">About This Event</h5>
            <div className="text-muted lh-base" style={{ whiteSpace: 'pre-line' }}>
              {description}
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold text-navy mb-3">Event Registration</h5>

            <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
            <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />

            {/* If registered successfully, show button to view QR pass */}
            {newRegistration && (
              <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 mb-4 text-center">
                <i className="bi bi-check-circle-fill text-success fs-2 d-block mb-2"></i>
                <h6 className="fw-bold text-success mb-2">You're Registered!</h6>
                <p className="small text-muted mb-3">Your QR Code has been generated for attendance verification.</p>
                <Link
                  to={`/my-registrations/${newRegistration.id}`}
                  className="btn btn-success btn-sm w-100 fw-semibold"
                >
                  <i className="bi bi-qr-code me-1"></i>View & Download QR Ticket
                </Link>
              </div>
            )}

            {/* Capacity status */}
            <div className="mb-4">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Available Seats</span>
                <span className="fw-bold text-navy">{availableSeats} of {capacity}</span>
              </div>
              <div className="progress mb-2" style={{ height: '8px' }}>
                <div
                  className={`progress-bar ${isFull ? 'bg-danger' : percentageBooked > 80 ? 'bg-warning' : 'bg-primary'}`}
                  role="progressbar"
                  style={{ width: `${percentageBooked}%` }}
                  aria-valuenow={percentageBooked}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="small text-muted text-end" style={{ fontSize: '0.75rem' }}>
                {percentageBooked}% Capacity Booked
              </div>
            </div>

            {/* Action buttons */}
            {isFull ? (
              <button className="btn btn-secondary w-100 py-2 fw-semibold mb-3" disabled>
                <i className="bi bi-slash-circle me-2"></i>Event Full (Sold Out)
              </button>
            ) : isPast ? (
              <button className="btn btn-secondary w-100 py-2 fw-semibold mb-3" disabled>
                <i className="bi bi-calendar-x me-2"></i>Event Completed
              </button>
            ) : (
              <button
                onClick={handleRegisterClick}
                disabled={registering}
                className="btn btn-primary w-100 py-2 fw-semibold mb-3"
              >
                {registering ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </span>
                ) : isAuthenticated ? (
                  <span>
                    <i className="bi bi-ticket-perforated me-2"></i>Register for Event
                  </span>
                ) : (
                  <span>
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In to Register
                  </span>
                )}
              </button>
            )}

            <div className="p-3 bg-light rounded-3 text-muted small">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-check2-circle text-primary me-2"></i>
                <span>Instant unique QR code pass</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-shield-check text-primary me-2"></i>
                <span>Guaranteed seat reservation</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-arrow-repeat text-primary me-2"></i>
                <span>Easy self-service cancellation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmModal}
        title="Confirm Event Registration"
        message={`Are you sure you want to register for "${eventName}" on ${eventDate}? A unique attendance QR pass will be created in your name.`}
        confirmText="Confirm Registration"
        confirmVariant="primary"
        onConfirm={handleConfirmRegistration}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default EventDetails;
