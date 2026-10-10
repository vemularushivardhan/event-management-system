import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import adminService from '../../services/adminService';
import AdminLayout from '../../components/AdminLayout';
import AlertMessage from '../../components/AlertMessage';

const AdminAttendance = () => {
  const [manualToken, setManualToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastVerified, setLastVerified] = useState(null);
  const [history, setHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);

  const scannerRef = useRef(null);
  const scannerContainerId = 'qr-reader-container';

  const processCheckIn = async (token) => {
    if (!token || !token.trim()) {
      setError('Please provide a valid QR token.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await adminService.checkInAttendance(token.trim());
      setSuccess(result.message);
      setLastVerified(result.registration);
      setHistory((prev) => [result.registration, ...prev.slice(0, 9)]);
      setManualToken('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Check-in failed. Please verify the QR token.';
      setError(msg);
      setLastVerified(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processCheckIn(manualToken);
  };

  const toggleCameraScanner = () => {
    if (cameraActive) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      setCameraActive(false);
    } else {
      setCameraActive(true);
    }
  };

  useEffect(() => {
    if (cameraActive) {
      const scanner = new Html5QrcodeScanner(
        scannerContainerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          // Success callback
          processCheckIn(decodedText);
        },
        (error) => {
          // Scan failure (ignore regular frame misses)
        }
      );

      scannerRef.current = scanner;

      return () => {
        scanner.clear().catch(console.error);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive]);

  return (
    <AdminLayout
      title="QR Attendance & Verification"
      subtitle="Scan digital QR passes or enter registration tokens to record live check-ins"
    >
      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
      <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />

      <div className="row g-4 mb-4">
        {/* Scanner & Entry Box */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-navy mb-0">
                <i className="bi bi-camera-video me-2 text-primary"></i>Camera QR Scanner
              </h5>
              <button
                type="button"
                className={`btn btn-sm ${cameraActive ? 'btn-outline-danger' : 'btn-outline-primary'} fw-semibold`}
                onClick={toggleCameraScanner}
              >
                {cameraActive ? (
                  <span><i className="bi bi-stop-circle me-1"></i>Stop Camera</span>
                ) : (
                  <span><i className="bi bi-play-circle me-1"></i>Start Camera</span>
                )}
              </button>
            </div>

            {cameraActive ? (
              <div className="p-3 bg-light rounded-3 text-center mb-4">
                <div id={scannerContainerId}></div>
                <p className="text-muted small mt-2 mb-0">
                  Align the participant's QR code within the scanning box.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-light rounded-3 text-center mb-4 border border-dashed">
                <i className="bi bi-qr-code-scan fs-1 text-muted d-block mb-2"></i>
                <p className="text-muted small mb-2">
                  Camera is currently inactive. Click below to activate your device's camera for scanning.
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-sm px-4 rounded-pill"
                  onClick={toggleCameraScanner}
                >
                  <i className="bi bi-camera-fill me-1"></i>Activate Camera Scanner
                </button>
              </div>
            )}

            {/* Manual Token Entry Fallback */}
            <div className="pt-3 border-top border-secondary-subtle">
              <h6 className="fw-bold text-navy mb-2">
                <i className="bi bi-keyboard me-2 text-primary"></i>Manual Token Entry Fallback
              </h6>
              <p className="text-muted small mb-3">
                If camera scanning is unavailable, manually type or paste the participant's QR token.
              </p>

              <form onSubmit={handleManualSubmit}>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-ticket-perforated"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. EVT1-U2-A1B2C3D4 or full QR token"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="btn btn-navy px-4 fw-semibold"
                    disabled={loading || !manualToken.trim()}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      'Verify & Check In'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Verification Result Card */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-navy mb-3">
              <i className="bi bi-shield-check me-2 text-success"></i>Verification Outcome
            </h5>

            {lastVerified ? (
              <div className="p-4 bg-success-subtle border border-success-subtle rounded-4 text-center">
                <i className="bi bi-check-circle-fill text-success fs-1 d-block mb-2"></i>
                <h4 className="fw-bold text-success mb-1">Check-In Successful!</h4>
                <p className="text-muted small mb-3">Participant admission confirmed and saved to database.</p>

                <div className="bg-white p-3 rounded-3 text-start shadow-sm mb-3">
                  <div className="row g-2 small">
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Participant</span>
                      <strong className="text-navy">{lastVerified.userName}</strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted d-block">Email</span>
                      <span className="text-navy">{lastVerified.userEmail}</span>
                    </div>
                    <div className="col-12 mt-2 pt-2 border-top">
                      <span className="text-muted d-block">Event</span>
                      <strong className="text-navy">{lastVerified.eventName}</strong>
                    </div>
                    <div className="col-sm-6 mt-2">
                      <span className="text-muted d-block">Venue</span>
                      <span>{lastVerified.venue}</span>
                    </div>
                    <div className="col-sm-6 mt-2">
                      <span className="text-muted d-block">Check-In Timestamp</span>
                      <span className="text-success fw-bold">
                        {new Date(lastVerified.checkInTime || Date.now()).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="badge badge-pill-status badge-attended fs-6 py-2 px-3">
                  <i className="bi bi-patch-check-fill me-1"></i>ATTENDED &bull; VALID PASS
                </div>
              </div>
            ) : (
              <div className="p-5 text-center bg-light rounded-4 text-muted">
                <i className="bi bi-qr-code fs-1 d-block mb-3 opacity-50"></i>
                <h6 className="fw-semibold text-navy">Awaiting QR Scan</h6>
                <p className="small mb-0">
                  Scan a QR ticket with the camera or submit a token to view attendee credentials and record attendance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Check-In Log */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="card-header bg-transparent py-3 px-4 border-bottom border-secondary-subtle">
          <h6 className="fw-bold text-navy mb-0">
            <i className="bi bi-clock-history me-2 text-primary"></i>Recent Check-Ins in This Session
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Event</th>
                  <th>QR Token</th>
                  <th>Status</th>
                  <th className="text-end">Verified At</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted small">
                      No check-ins performed yet in this session.
                    </td>
                  </tr>
                ) : (
                  history.map((h, i) => (
                    <tr key={i}>
                      <td>
                        <div className="fw-bold text-navy">{h.userName}</div>
                        <div className="text-muted small">{h.userEmail}</div>
                      </td>
                      <td className="small text-truncate" style={{ maxWidth: '200px' }}>
                        {h.eventName}
                      </td>
                      <td>
                        <code>{h.qrToken}</code>
                      </td>
                      <td>
                        <span className="badge badge-pill-status badge-attended">
                          {h.attendanceStatus}
                        </span>
                      </td>
                      <td className="text-end small text-muted">
                        {new Date(h.checkInTime || Date.now()).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAttendance;
