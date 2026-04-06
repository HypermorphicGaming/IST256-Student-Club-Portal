import React, { useState } from "react";

const ClubPortalFinalization = () => {
  const [events, setEvents] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState("");
  const [communicationPrefs, setCommunicationPrefs] = useState([]);
  const [notes, setNotes] = useState("");

  const handleEventsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setEvents(selected);
  };

  const handleMembershipChange = (e) => setMembershipStatus(e.target.value);

  const handleCommunicationChange = (e) => {
    const value = e.target.value;
    setCommunicationPrefs(prev =>
      prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
    );
  };

  const handleNotesChange = (e) => setNotes(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { events, membershipStatus, communicationPrefs, notes, timestamp: new Date().toISOString() };
    const jsonDocument = JSON.stringify(formData, null, 2);
    localStorage.setItem("club_portal_finalization", jsonDocument);

    fetch("/api/club/submitFinalization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonDocument
    })
      .then(res => res.json())
      .then(() => alert("Your selections have been submitted successfully."))
      .catch(() => alert("There was an error submitting your selections."));
  };

  const styles = {
    container: { maxWidth: "600px", margin: "50px auto", padding: "25px", borderRadius: "10px", background: "#f0f8ff", boxShadow: "0 0 15px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif" },
    h2: { textAlign: "center", marginBottom: "20px", color: "#222" },
    label: { display: "block", marginBottom: "10px", fontWeight: "bold", color: "#333" },
    select: { width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" },
    input: { marginRight: "10px" },
    textarea: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "80px", marginBottom: "20px" },
    button: { background: "#0073e6", color: "#fff", padding: "12px 20px", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%", fontSize: "16px" },
    checkboxGroup: { marginBottom: "20px" },
    radioGroup: { marginBottom: "20px" }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.h2}>Finalize Your Club Participation</h2>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Select Club Events to Attend:</label>
        <select multiple value={events} onChange={handleEventsChange} style={styles.select}>
          <option value="socialNight">Social Night</option>
          <option value="workshop">Workshop</option>
          <option value="tournament">Tournament</option>
          <option value="communityService">Community Service</option>
        </select>

        <div style={styles.radioGroup}>
          <span style={styles.label}>Membership Status:</span>
          <label><input type="radio" name="membershipStatus" value="active" checked={membershipStatus === "active"} onChange={handleMembershipChange} style={styles.input} /> Active</label>
          <label><input type="radio" name="membershipStatus" value="inactive" checked={membershipStatus === "inactive"} onChange={handleMembershipChange} style={styles.input} /> Inactive</label>
        </div>

        <div style={styles.checkboxGroup}>
          <span style={styles.label}>Communication Preferences:</span>
          <label><input type="checkbox" value="newsletter" checked={communicationPrefs.includes("newsletter")} onChange={handleCommunicationChange} style={styles.input} /> Newsletter</label>
          <label><input type="checkbox" value="eventUpdates" checked={communicationPrefs.includes("eventUpdates")} onChange={handleCommunicationChange} style={styles.input} /> Event Updates</label>
          <label><input type="checkbox" value="alerts" checked={communicationPrefs.includes("alerts")} onChange={handleCommunicationChange} style={styles.input} /> Alerts</label>
        </div>

        <label style={styles.label}>Additional Notes or Requests:</label>
        <textarea value={notes} onChange={handleNotesChange} style={styles.textarea} />

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

export default ClubPortalFinalization;