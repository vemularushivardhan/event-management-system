import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingEvent, setDeletingEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteClick = (evt) => {
    setDeletingEvent(evt);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;

    try {
      setError('');
      await eventService.deleteEvent(deletingEvent.id);
      setSuccess(`Event "${deletingEvent.eventName}" deleted successfully.`);
      setDeletingEvent(null);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event.');
      setDeletingEvent(null);
    }
  };

  const filteredEvents = events.filter((e) =>
    e.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="Manage Events"
      subtitle="View, create, edit, and organize summits and workshops"
      actionButton={
        <Link to="/admin/events/create" className="btn btn-primary btn-sm fw-semibold">
          <i className="bi bi-plus-lg me-1"></i>Create New Event
        </Link>
      }
    >
      <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
      <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-end-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by event name or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-light border"
              type="button"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading events..." />
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-secondary-subtle">
          <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
          <h5 className="fw-bold text-navy">No Events Found</h5>
          <p className="text-muted small mb-3">No events match your search criteria.</p>
          <Link to="/admin/events/create" className="btn btn-primary btn-sm px-4 rounded-pill">
            Create an Event
          </Link>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-custom table-hover mb-0">
              <thead>
                <tr>
                  <th>Event Details</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Registered</th>
                  <th>Available</th>
                  <th>Capacity</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => {
                  const registered = evt.capacity - evt.availableSeats;
                  return (
                    <tr key={evt.id}>
                      <td>
                        <div className="fw-bold text-navy">{evt.eventName}</div>
                        <div className="text-muted small text-truncate" style={{ maxWidth: '240px' }}>
                          {evt.description}
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-navy">{evt.eventDate}</div>
                        <div className="text-muted small">{evt.eventTime}</div>
                      </td>
                      <td>
                        <span className="small text-muted">{evt.venue}</span>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                          {registered}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${evt.availableSeats === 0 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                          {evt.availableSeats}
                        </span>
                      </td>
                      <td>
                        <span className="small fw-semibold">{evt.capacity}</span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/admin/registrations?eventId=${evt.id}`}
                            className="btn btn-outline-info btn-sm px-2"
                            title="View registered participants for this event"
                          >
                            <i className="bi bi-people"></i>
                          </Link>
                          <Link
                            to={`/admin/events/edit/${evt.id}`}
                            className="btn btn-outline-primary btn-sm px-2"
                            title="Edit event details"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(evt)}
                            className="btn btn-outline-danger btn-sm px-2"
                            title="Delete this event safely"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
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

      {/* Deletion confirmation modal */}
      <ConfirmationModal
        show={!!deletingEvent}
        title="Delete Event"
        message={`Are you sure you want to delete "${deletingEvent?.eventName}"? All existing attendee registrations associated with this event will also be deleted.`}
        confirmText="Yes, Delete Event"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingEvent(null)}
      />
    </AdminLayout>
  );
};

export default AdminEvents;
