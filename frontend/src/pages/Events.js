import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [fromDate, setFromDate] = useState(searchParams.get('fromDate') || '');
  const [toDate, setToDate] = useState(searchParams.get('toDate') || '');
  const [onlyAvailable, setOnlyAvailable] = useState(searchParams.get('onlyAvailable') === 'true');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (onlyAvailable) params.onlyAvailable = true;

      const data = await eventService.getAllEvents(params);
      setEvents(data);
    } catch (err) {
      setError('Failed to load events. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Sync state into URL query params
    const nextParams = {};
    if (search.trim()) nextParams.search = search.trim();
    if (fromDate) nextParams.fromDate = fromDate;
    if (toDate) nextParams.toDate = toDate;
    if (onlyAvailable) nextParams.onlyAvailable = 'true';
    setSearchParams(nextParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, onlyAvailable]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setOnlyAvailable(false);
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold text-navy mb-1">Browse Events</h2>
          <p className="text-muted small mb-0">Explore tech conferences, summits, and hands-on workshops</p>
        </div>
        <div className="text-muted small mt-2 mt-md-0">
          Showing <span className="fw-bold text-navy">{events.length}</span> events
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-3 align-items-end">
            <div className="col-lg-4 col-md-6">
              <label className="form-label small fw-semibold text-muted mb-1">Search Event</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Event title, keywords, or venue..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <label className="form-label small fw-semibold text-muted mb-1">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-3 col-6">
              <label className="form-label small fw-semibold text-muted mb-1">To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="col-lg-2 col-md-6 d-flex align-items-center mb-2 mb-md-0">
              <div className="form-check form-switch mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="availableOnlySwitch"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold text-navy ms-1" htmlFor="availableOnlySwitch">
                  Available Only
                </label>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 d-flex gap-2">
              <button type="submit" className="btn btn-primary w-100 fw-semibold">
                Apply
              </button>
              {(search || fromDate || toDate || onlyAvailable) && (
                <button
                  type="button"
                  className="btn btn-light border px-3"
                  onClick={handleResetFilters}
                  title="Reset all filters"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />

      {/* Events Grid */}
      {loading ? (
        <LoadingSpinner text="Searching live events..." />
      ) : events.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-secondary-subtle">
          <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-navy">No Events Match Your Filters</h5>
          <p className="text-muted small mb-3">Try adjusting your search keywords, dates, or clearing availability filters.</p>
          <button className="btn btn-outline-primary btn-sm px-4 rounded-pill" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {events.map((event) => (
            <div key={event.id} className="col-md-6 col-lg-4">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
