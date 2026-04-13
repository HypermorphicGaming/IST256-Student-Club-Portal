import { useState } from 'react';
import PageShell from './components/PageShell';
import { formatCurrency, normalizeText, parseOpenSeats, parsePrice, safeReadArray } from './utils/productUtils';
import { createRandomEvent } from './utils/testDataUtils';
import useTimedMessage from './hooks/useTimedMessage';
import { createEmptyEventForm, createEventForm } from './utils/managementForms';

function ManageEvents() {
  const [formData, setFormData] = useState(() => createEmptyEventForm());
  const [events, setEvents] = useState(() => safeReadArray('club_events'));
  const [editingEventId, setEditingEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, showMessage, clearMessage] = useTimedMessage('');
  const [errors, setErrors] = useState({});

  const normalizeEventDraft = (draft) => ({
    eventName: normalizeText(draft.eventName),
    eventCategory: normalizeText(draft.eventCategory),
    eventDuration: Number.parseInt(draft.eventDuration, 10) || 60,
    eventDate: normalizeText(draft.eventDate),
    eventTime: normalizeText(draft.eventTime),
    eventCost: parsePrice(draft.eventCost),
    openSeats: parseOpenSeats(draft.openSeats),
    locationRoomNumber: normalizeText(draft.locationRoomNumber),
    eventDescription: normalizeText(draft.eventDescription)
  });

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'eventName':
        if (!value.trim()) error = 'Event name is required.';
        else if (value.length < 2) error = 'Event name must be at least 2 characters.';
        break;
      case 'eventCategory':
        if (!value) error = 'Event category is required.';
        break;
      case 'eventDate':
        if (!value) error = 'Event date is required.';
        else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) error = 'Event date cannot be in the past.';
        }
        break;
      case 'eventCost':
        if (value < 0) error = 'Event cost cannot be negative.';
        break;
      case 'openSeats':
        if (!value || value < 1) error = 'Open seats must be at least 1.';
        break;
      case 'locationRoomNumber':
        if (!value.trim()) error = 'Location/Room number is required.';
        break;
      case 'eventDescription':
        if (!value.trim()) error = 'Event description is required.';
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedData = normalizeEventDraft(formData);
    const newErrors = {};
    Object.keys(normalizedData).forEach(key => {
      const error = validateField(key, normalizedData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const duplicateEvent = events.some((event) => (
      event.eventId !== editingEventId &&
      normalizeText(event.eventName).toLowerCase() === normalizedData.eventName.toLowerCase() &&
      normalizeText(event.eventDate) === normalizedData.eventDate &&
      normalizeText(event.eventTime) === normalizedData.eventTime
    ));

    if (duplicateEvent) {
      showMessage('An event with the same name, date, and time already exists.');
      return;
    }

    const updatedEvents = editingEventId
      ? events.map((event) => (
          event.eventId === editingEventId
            ? {
                ...event,
                ...normalizedData,
                eventId: editingEventId,
                eventCost: normalizedData.eventCost,
                openSeats: normalizedData.openSeats
              }
            : event
        ))
      : [...events, {
          ...normalizedData,
          eventId: `event-${Date.now()}`,
          eventCost: normalizedData.eventCost,
          openSeats: normalizedData.openSeats
        }];

    setEvents(updatedEvents);
    localStorage.setItem('club_events', JSON.stringify(updatedEvents));
    setFormData(createEmptyEventForm());
    setEditingEventId(null);
    setErrors({});
    showMessage(editingEventId ? 'Event updated successfully.' : 'Event details saved successfully.');
  };

  const handleReset = () => {
    setFormData(createEmptyEventForm());
    setEditingEventId(null);
    setErrors({});
  };

  const handleEditEvent = (event) => {
    setFormData(createEventForm(event));
    setEditingEventId(event.eventId);
    setErrors({});
    showMessage('Editing selected event.');
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.eventId !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('club_events', JSON.stringify(updatedEvents));

    if (editingEventId === eventId) {
      handleReset();
    }

    showMessage('Event deleted successfully.');
  };

  const handleGenerateTestEvents = () => {
    const generatedEvents = Array.from({ length: 3 }, () => createRandomEvent());
    const updatedEvents = [...events, ...generatedEvents];
    setEvents(updatedEvents);
    localStorage.setItem('club_events', JSON.stringify(updatedEvents));
    showMessage(`Generated ${generatedEvents.length} test events.`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const filteredEvents = events.filter(event =>
    `${event.eventName} ${event.eventDescription} ${event.eventCategory} ${event.locationRoomNumber}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <PageShell>
      <div className="container management-page__section">
        <div className="card p-4 mb-4">
          <h2 className="text-center mb-2">Manage Events</h2>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="eventName" className="form-label">Event Name <strong className="text-danger">*</strong></label>
              <input
                type="text"
                className={`form-control ${errors.eventName ? 'is-invalid' : formData.eventName && !errors.eventName ? 'is-valid' : ''}`}
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              {errors.eventName && <div className="text-danger">{errors.eventName}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="eventCategory" className="form-label">Event Type/Category <strong className="text-danger">*</strong></label>
              <select
                className={`form-select ${errors.eventCategory ? 'is-invalid' : formData.eventCategory && !errors.eventCategory ? 'is-valid' : ''}`}
                id="eventCategory"
                name="eventCategory"
                value={formData.eventCategory}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose...</option>
                <option value="social">Social</option>
                <option value="meeting">Meeting</option>
                <option value="professional">Professional</option>
              </select>
              {errors.eventCategory && <div className="text-danger">{errors.eventCategory}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="eventDuration" className="form-label">Event Duration</label>
              <div className="d-flex gap-3 align-items-center">
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  id="eventDuration"
                  name="eventDuration"
                  min="15"
                  max="180"
                  step="15"
                  value={formData.eventDuration}
                  onChange={handleInputChange}
                />
                <span className="badge bg-secondary fw-normal" style={{ minWidth: '60px' }}>
                  {formatDuration(formData.eventDuration)}
                </span>
              </div>
              {errors.eventDuration && <div className="text-danger">{errors.eventDuration}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="eventDate" className="form-label">Event Date <strong className="text-danger">*</strong></label>
              <input
                type="date"
                className={`form-control ${errors.eventDate ? 'is-invalid' : formData.eventDate && !errors.eventDate ? 'is-valid' : ''}`}
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
              />
              {errors.eventDate && <div className="text-danger">{errors.eventDate}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="eventTime" className="form-label">Start Time</label>
              <input
                type="time"
                className={`form-control ${errors.eventTime ? 'is-invalid' : formData.eventTime && !errors.eventTime ? 'is-valid' : ''}`}
                id="eventTime"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleInputChange}
              />
              {errors.eventTime && <div className="text-danger">{errors.eventTime}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="eventCost" className="form-label">Registration Cost (USD)</label>
              <input
                type="number"
                className={`form-control ${errors.eventCost ? 'is-invalid' : formData.eventCost !== '' && !errors.eventCost ? 'is-valid' : ''}`}
                id="eventCost"
                name="eventCost"
                min="0"
                step="0.01"
                value={formData.eventCost}
                onChange={handleInputChange}
                autoComplete="off"
              />
              {errors.eventCost && <div className="text-danger">{errors.eventCost}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="openSeats" className="form-label">Open Seats <strong className="text-danger">*</strong></label>
              <input
                type="number"
                className={`form-control ${errors.openSeats ? 'is-invalid' : formData.openSeats && !errors.openSeats ? 'is-valid' : ''}`}
                id="openSeats"
                name="openSeats"
                min="1"
                step="1"
                value={formData.openSeats}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              {errors.openSeats && <div className="text-danger">{errors.openSeats}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="locationRoomNumber" className="form-label">Location/Room Number <strong className="text-danger">*</strong></label>
              <input
                type="text"
                className={`form-control ${errors.locationRoomNumber ? 'is-invalid' : formData.locationRoomNumber && !errors.locationRoomNumber ? 'is-valid' : ''}`}
                id="locationRoomNumber"
                name="locationRoomNumber"
                value={formData.locationRoomNumber}
                onChange={handleInputChange}
                autoComplete="off"
                required
              />
              {errors.locationRoomNumber && <div className="text-danger">{errors.locationRoomNumber}</div>}
            </div>

            <div className="col-12">
              <label htmlFor="eventDescription" className="form-label">Event Description <strong className="text-danger">*</strong></label>
              <textarea
                className={`form-control ${errors.eventDescription ? 'is-invalid' : formData.eventDescription && !errors.eventDescription ? 'is-valid' : ''}`}
                id="eventDescription"
                name="eventDescription"
                rows="3"
                value={formData.eventDescription}
                onChange={handleInputChange}
                required
              />
              {errors.eventDescription && <div className="text-danger">{errors.eventDescription}</div>}
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">{editingEventId ? 'Update Event' : 'Add Event'}</button>
              <button className="btn btn-secondary" type="reset" onClick={handleReset}>Clear Form</button>
              <button className="btn btn-outline-primary" type="button" onClick={handleGenerateTestEvents}>
                Generate Test Events
              </button>
            </div>
          </form>
        </div>

        {message && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Status:</strong> {message}
            <button type="button" className="btn-close" onClick={clearMessage} aria-label="Close"></button>
          </div>
        )}
      </div>

      <div className="container management-page__section management-page__directory text-center">
        <h3 className="mb-3">Event Directory</h3>
        <input
          type="text"
          id="searchInput"
          className="form-control mb-3"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="management-page__results">
          {filteredEvents.length === 0 ? (
            <p>No events added yet.</p>
          ) : (
            <div className="row">
              {filteredEvents.map(event => (
                <div key={event.eventId} className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{event.eventName}</h5>
                      <p className="card-text">
                        <strong>Category:</strong> {event.eventCategory}<br/>
                        <strong>Date:</strong> {event.eventDate}<br/>
                        <strong>Time:</strong> {event.eventTime || 'TBD'}<br/>
                        <strong>Duration:</strong> {formatDuration(event.eventDuration)}<br/>
                        <strong>Location:</strong> {event.locationRoomNumber}<br/>
                        <strong>Open Seats:</strong> {event.openSeats}<br/>
                        <strong>Cost:</strong> {formatCurrency(event.eventCost)}<br/>
                        <strong>Description:</strong> {event.eventDescription}
                      </p>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditEvent(event)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteEvent(event.eventId)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default ManageEvents;