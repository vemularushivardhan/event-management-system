import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import registrationService from '../services/registrationService';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const RegistrationConfirmation = () => {
  const { id } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await registrationService.getRegistrationById(id);
        setRegistration(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load registration details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [id]);

  const handleDownloadQr = () => {
    if (!registration) return;

    // First attempt to download from rendered canvas
    const canvas = document.getElementById('qr-canvas-download');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `EventHub-Pass-${registration.qrToken}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (registration.qrCodeBase64) {
      // Fallback: download the backend-generated QR Base64 PNG
      const downloadLink = document.createElement('a');
      downloadLink.href = registration.qrCodeBase64;
      downloadLink.download = `EventHub-Pass-${registration.qrToken}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving digital QR ticket..." />;
  }

  if (!registration) {
    return (
      <div className="container py-5 text-center">
        <AlertMessage variant="danger" message={error || 'Registration record not found.'} />
        <Link to="/my-registrations" className="btn btn-primary mt-3">
          <i className="bi bi-arrow-left me-2"></i>Back to My Registrations
        </Link>
      </div>
    );
  }

  const {
    eventName,
    eventDate,
    eventTime,
    venue,
    userName,
    userEmail,
    userPhone,
    registrationDate,
    qrToken,
    registrationStatus,
    attendanceStatus,
    checkInTime,
  } = registration;

  const isCancelled = registrationStatus === 'CANCELLED';
  const isAttended = attendanceStatus === 'ATTENDED';

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/my-registrations" className="text-decoration-none text-muted small fw-semibold">
          <i className="bi bi-arrow-left me-1"></i>Back to My Registrations
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Hidden Canvas used for high-res PNG download generation */}
          <div style={{ display: 'none' }}>
            <QRCodeCanvas
              id="qr-canvas-download"
              value={qrToken}
              size={512}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
            <div className="card-header bg-navy text-white text-center py-4 border-0">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-semibold mb-2">
                Official Event Admission Pass
              </span>
              <h3 className="fw-bold mb-1">{eventName}</h3>
              <p className="text-light small mb-0 opacity-75">
                <i className="bi bi-geo-alt me-1"></i>{venue}
              </p>
            </div>

            <div className="card-body p-4 p-lg-5">
              <div className="row align-items-center g-4 mb-4">
                {/* QR Code Graphic */}
                <div className="col-md-5 text-center">
                  <div className={`qr-ticket-card ${isCancelled ? 'border-danger bg-danger-subtle' : ''}`}>
                    <div className="qr-frame mb-3">
                      <QRCodeSVG
                        value={qrToken}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <div className="mb-2">
                      <span className="qr-token-pill">{qrToken}</span>
                    </div>

                    <button
                      onClick={handleDownloadQr}
                      className="btn btn-outline-primary btn-sm w-100 fw-semibold rounded-pill mt-2"
                      disabled={isCancelled}
                    >
                      <i className="bi bi-download me-1"></i>Download QR Pass (PNG)
                    </button>
                  </div>
                </div>

                {/* Ticket & Attendee Details */}
                <div className="col-md-7">
                  <div className="d-flex gap-2 mb-3">
                    {isCancelled ? (
                      <span className="badge badge-pill-status badge-cancelled">
                        <i className="bi bi-x-circle me-1"></i>Cancelled Pass
                      </span>
                    ) : (
                      <span className="badge badge-pill-status badge-confirmed">
                        <i className="bi bi-check-circle me-1"></i>Confirmed Pass
                      </span>
                    )}

                    {isAttended ? (
                      <span className="badge badge-pill-status badge-attended">
                        <i className="bi bi-patch-check-fill me-1"></i>Attended
                      </span>
                    ) : (
                      <span className="badge badge-pill-status badge-registered">
                        <i className="bi bi-hourglass-split me-1"></i>Registered
                      </span>
                    )}
                  </div>

                  <h5 className="fw-bold text-navy mb-3">Attendee Information</h5>

                  <div className="mb-2">
                    <span className="text-muted small d-block">Participant Name</span>
                    <span className="fw-bold text-navy">{userName}</span>
                  </div>

                  <div className="row mb-2">
                    <div className="col-sm-6 mb-2 mb-sm-0">
                      <span className="text-muted small d-block">Email</span>
                      <span className="small text-navy">{userEmail}</span>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted small d-block">Phone</span>
                      <span className="small text-navy">{userPhone}</span>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-sm-6 mb-2 mb-sm-0">
                      <span className="text-muted small d-block">Event Date</span>
                      <span className="small text-navy fw-semibold">{eventDate}</span>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted small d-block">Event Time</span>
                      <span className="small text-navy fw-semibold">{eventTime}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-top border-secondary-subtle small text-muted">
                    <div>Registered on: {new Date(registrationDate).toLocaleString()}</div>
                    {checkInTime && (
                      <div className="text-success fw-semibold mt-1">
                        <i className="bi bi-check-all me-1"></i>Check-in verified: {new Date(checkInTime).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Check-In Instructions */}
              <div className="p-3 bg-light rounded-3 border border-secondary-subtle small">
                <div className="fw-bold text-navy mb-1">
                  <i className="bi bi-info-circle text-primary me-1"></i>Attendance Instructions
                </div>
                <p className="text-muted mb-0">
                  Please show this QR pass on your mobile device or bring a printed copy to the event entrance desk. The event administrator will scan this pass with the camera scanner to verify admission and mark your attendance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
