import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents();
        // Show up to 6 events on the homepage
        setUpcomingEvents(data.slice(0, 6));
      } catch (err) {
        setError('Failed to fetch events from backend. Please ensure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-lg-8 mx-auto text-center">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
                <i className="bi bi-stars me-1"></i>Premier Event Management & QR Verification
              </span>
              <h1 className="hero-title mb-3">
                Discover, Register & Attend Technical Conferences Seamlessly
              </h1>
              <p className="hero-subtitle mx-auto mb-4">
                Browse upcoming developer summits, reserve seats with instant QR digital passes, and experience contactless event check-ins.
              </p>

              {/* Hero Search Box */}
              <div className="search-box-hero mx-auto" style={{ maxWidth: '650px' }}>
                <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none ps-0"
                      placeholder="Search summit name, tech topic, or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary px-4 rounded-3 fw-semibold">
                    Find Events
                  </button>
                </form>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link to="/events" className="btn btn-outline-light px-4 rounded-pill">
                  <i className="bi bi-grid-fill me-2"></i>Browse All Events
                </Link>
                <Link to="/register" className="btn btn-primary px-4 rounded-pill">
                  <i className="bi bi-person-plus-fill me-2"></i>Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-5 bg-white border-bottom border-secondary-subtle">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-3">
                <div className="stat-icon mx-auto mb-3 bg-primary-subtle text-primary">
                  <i className="bi bi-qr-code-scan"></i>
                </div>
                <h5 className="fw-bold text-navy">Instant QR Passes</h5>
                <p className="text-muted small mb-0">
                  Unique, cryptographically generated QR ticket issued instantly upon registration with one-click PNG download.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div className="stat-icon mx-auto mb-3 bg-success-subtle text-success">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 className="fw-bold text-navy">Fraud-Proof Verification</h5>
                <p className="text-muted small mb-0">
                  Server-side check-in verification strictly prevents unauthorized attendees, duplicates, or cancelled tickets.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3">
                <div className="stat-icon mx-auto mb-3 bg-warning-subtle text-warning">
                  <i className="bi bi-pie-chart-fill"></i>
                </div>
                <h5 className="fw-bold text-navy">Real-Time Capacity</h5>
                <p className="text-muted small mb-0">
                  Live seat availability tracking prevents overbooking and guarantees real-time capacity monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <h3 className="fw-bold text-navy mb-1">Upcoming Events</h3>
              <p className="text-muted small mb-0">Explore and register for upcoming conferences and workshops</p>
            </div>
            <Link to="/events" className="btn btn-outline-primary btn-sm mt-3 mt-md-0 fw-semibold">
              View All Events <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

          {loading ? (
            <LoadingSpinner text="Fetching live events from database..." />
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-3 border border-secondary-subtle">
              <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
              <h5 className="fw-bold text-navy">No Upcoming Events Found</h5>
              <p className="text-muted small mb-3">No events are scheduled at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="row g-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="col-md-6 col-lg-4">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
