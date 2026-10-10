import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const { id, eventName, description, eventDate, eventTime, venue, capacity, availableSeats, isFull } = event;

  const percentageTaken = capacity > 0 ? Math.round(((capacity - availableSeats) / capacity) * 100) : 0;

  return (
    <div className="event-card">
      <div className="p-4 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="card-date-badge">
            <div className="small text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
              {new Date(eventDate).toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="fs-4 lh-1">
              {new Date(eventDate).getDate()}
            </div>
          </div>
          {isFull ? (
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 small fw-semibold">
              <i className="bi bi-x-circle me-1"></i>Sold Out
            </span>
          ) : (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small fw-semibold">
              <i className="bi bi-check-circle me-1"></i>{availableSeats} Seats Left
            </span>
          )}
        </div>

        <h5 className="fw-bold text-navy mb-2 line-clamp-1">{eventName}</h5>
        <p className="text-muted small mb-3 flex-grow-1 line-clamp-2" style={{ minHeight: '2.5rem' }}>
          {description}
        </p>

        <div className="text-muted small mb-3">
          <div className="d-flex align-items-center mb-1">
            <i className="bi bi-clock me-2 text-primary"></i>
            <span>{eventTime}</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-geo-alt me-2 text-primary"></i>
            <span className="text-truncate">{venue}</span>
          </div>
        </div>

        {/* Seat Availability Progress Bar */}
        <div className="mb-3">
          <div className="d-flex justify-content-between text-muted small mb-1" style={{ fontSize: '0.75rem' }}>
            <span>Capacity ({capacity - availableSeats}/{capacity})</span>
            <span>{percentageTaken}% Booked</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div
              className={`progress-bar ${isFull ? 'bg-danger' : percentageTaken > 80 ? 'bg-warning' : 'bg-primary'}`}
              role="progressbar"
              style={{ width: `${percentageTaken}%` }}
              aria-valuenow={percentageTaken}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Link to={`/events/${id}`} className="btn btn-primary w-100 fw-semibold">
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
