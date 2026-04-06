import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";

export default function ManageEvents() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventCategory: "",
    eventDuration: 60,
    eventDate: "",
    eventTime: "",
    eventCost: 0,
    openSeats: "",
    locationRoomNumber: "",
    eventDescription: "",
  });

  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add event to list
    setEvents((prev) => [...prev, formData]);

    setMessage("Event added successfully!");
    setTimeout(() => setMessage(""), 3000);

    // Reset form
    setFormData({
      eventName: "",
      eventCategory: "",
      eventDuration: 60,
      eventDate: "",
      eventTime: "",
      eventCost: 0,
      openSeats: "",
      locationRoomNumber: "",
      eventDescription: "",
    });
  };

  const filteredEvents = events.filter((ev) =>
    ev.eventName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="container my-5 p-5">
        <div className="card p-4 mb-4">
          <h2 className="text-center mb-2">Manage Events</h2>

          <form className="row g-3" onSubmit={handleSubmit}>
            {/* Event Name */}
            <div className="col-md-6">
              <label className="form-label">
                Event Name <strong className="text-danger">*</strong>
              </label>
              <input
                type="text"
                className="form-control"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label className="form-label">
                Event Type/Category <strong className="text-danger">*</strong>
              </label>
              <select
                className="form-select"
                name="eventCategory"
                value={formData.eventCategory}
                onChange={handleChange}
                required
              >
                <option value="">Choose...</option>
                <option value="social">Social</option>
                <option value="meeting">Meeting</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            {/* Duration */}
            <div className="col-md-6">
              <label className="form-label">Event Duration</label>
              <div className="d-flex gap-3 align-items-center">
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  min="15"
                  max="180"
                  step="15"
                  name="eventDuration"
                  value={formData.eventDuration}
                  onChange={handleChange}
                />
                <span className="badge bg-secondary fw-normal" style={{ minWidth: "60px" }}>
                  {formData.eventDuration / 60}h
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="col-md-6">
              <label className="form-label">
                Event Date <strong className="text-danger">*</strong>
              </label>
              <input
                type="date"
                className="form-control"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Time */}
            <div className="col-md-6">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
              />
            </div>

            {/* Cost */}
            <div className="col-md-6">
              <label className="form-label">Registration Cost (USD)</label>
              <input
                type="number"
                className="form-control"
                name="eventCost"
                min="0"
                step="0.01"
                value={formData.eventCost}
                onChange={handleChange}
              />
            </div>

            {/* Seats */}
            <div className="col-md-6">
              <label className="form-label">
                Open Seats <strong className="text-danger">*</strong>
              </label>
              <input
                type="number"
                className="form-control"
                name="openSeats"
                min="1"
                value={formData.openSeats}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location */}
            <div className="col-md-6">
              <label className="form-label">
                Location/Room Number <strong className="text-danger">*</strong>
              </label>
              <input
                type="text"
                className="form-control"
                name="locationRoomNumber"
                value={formData.locationRoomNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">
                Event Description <strong className="text-danger">*</strong>
              </label>
              <textarea
                className="form-control"
                rows="3"
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                Add Event
              </button>
              <button
                className="btn btn-secondary"
                type="reset"
                onClick={() =>
                  setFormData({
                    eventName: "",
                    eventCategory: "",
                    eventDuration: 60,
                    eventDate: "",
                    eventTime: "",
                    eventCost: 0,
                    openSeats: "",
                    locationRoomNumber: "",
                    eventDescription: "",
                  })
                }
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {message && (
          <div className="alert alert-success">{message}</div>
        )}
      </div>

      {/* Event Directory */}
      <div className="container mt-1 mb-5 p-5 text-center">
        <h3 className="mb-3">Event Directory</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="my-5">
          {filteredEvents.length === 0 ? (
            <p>No events found.</p>
          ) : (
            filteredEvents.map((ev, index) => (
              <div key={index} className="card p-3 mb-3">
                <h5>{ev.eventName}</h5>
                <p>{ev.eventDescription}</p>
                <p>
                  <strong>Date:</strong> {ev.eventDate} |{" "}
                  <strong>Seats:</strong> {ev.openSeats}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-auto d-flex align-items-center justify-content-center">
        <p className="mb-0">&copy; 2026 Student Club Portal | IST 256 Group 1</p>
      </footer>
    </div>
  );
}