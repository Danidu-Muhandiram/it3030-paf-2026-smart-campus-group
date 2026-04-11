import React, { useState } from "react";

function BookingPage() {
  const [formData, setFormData] = useState({
    resource: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Data:", formData);
    alert("Booking request submitted!");
  };

  return (
    <div style={styles.container}>
      <h2>Book a Resource</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Resource</label>
        <select
          name="resource"
          value={formData.resource}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Resource</option>
          <option value="Lecture Hall">Lecture Hall</option>
          <option value="Computer Lab">Computer Lab</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Projector">Projector</option>
        </select>

        <label style={styles.label}>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Start Time</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>End Time</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Purpose</label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Enter booking purpose"
          style={styles.input}
          required
        />

        <label style={styles.label}>Expected Attendees</label>
        <input
          type="number"
          name="attendees"
          value={formData.attendees}
          onChange={handleChange}
          placeholder="Enter number of attendees"
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Submit Booking
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    marginTop: "10px",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #aaa",
  },
  button: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default BookingPage;