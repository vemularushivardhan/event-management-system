import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const AdminEventForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    eventDate: '',
    eventTime: '10:00:00',
    venue: '',
    capacity: 100,
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const data = await eventService.getEventById(id);
          setFormData({
            eventName: data.eventName,
            description: data.description,
            eventDate: data.eventDate,
            eventTime: data.eventTime,
            venue: data.venue,
            capacity: data.capacity,
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load event details.');
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.eventName.trim() || !formData.description.trim() || !formData.eventDate || !formData.eventTime || !formData.venue.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.capacity || formData.capacity < 1) {
      setError('Capacity must be a positive integer of at least 1 seat.');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await eventService.updateEvent(id, formData);
        setSuccess('Event updated successfully!');
      } else {
        await eventService.createEvent(formData);
        setSuccess('Event created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/events');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save event. Please check inputs.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title={isEditing ? 'Edit Event' : 'Create New Event'}
      subtitle={isEditing ? `Modifying event ID #${id}` : 'Publish a new tech conference or seminar'}
      actionButton={
        <Link to="/admin/events" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Back to Events
        </Link>
      }
    >
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white">
            <AlertMessage variant="danger" message={error} onClose={() => setError('')} />
            <AlertMessage variant="success" message={success} onClose={() => setSuccess('')} />

            {loading ? (
              <LoadingSpinner text="Retrieving event details..." />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">
                    Event Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    className="form-control"
                    placeholder="e.g. NextGen Microservices Summit 2026"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-navy">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Comprehensive description of agenda, speakers, keynote sessions, and prerequisites..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label small fw-semibold text-navy">
                      Event Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      className="form-control"
                      value={formData.eventDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-navy">
                      Event Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      step="1"
                      name="eventTime"
                      className="form-control"
                      value={formData.eventTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-8 mb-3 mb-md-0">
                    <label className="form-label small fw-semibold text-navy">
                      Venue / Location <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="venue"
                      className="form-control"
                      placeholder="e.g. Innovation Hall, Convention Plaza, Chicago"
                      value={formData.venue}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-navy">
                      Seating Capacity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      className="form-control"
                      placeholder="100"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary-subtle">
                  <Link to="/admin/events" className="btn btn-light px-4">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </span>
                    ) : isEditing ? (
                      'Update Event'
                    ) : (
                      'Publish Event'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEventForm;
