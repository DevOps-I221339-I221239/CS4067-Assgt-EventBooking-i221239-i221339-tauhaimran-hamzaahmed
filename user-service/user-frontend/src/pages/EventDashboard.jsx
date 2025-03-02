import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    availableSeats: "",
    price: ""
  });

  // Fetch Events on Page Load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5002/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Handle input change for new event
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Create an event
  const createEvent = async () => {
    try {
      const res = await axios.post("http://localhost:5002/events", newEvent);
      setEvents([...events, res.data]);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // Delete an event
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div>
      <h2>Event Management Dashboard</h2>
      <button onClick={() => navigate("/login")}>Logout</button>

      <h3>Create New Event</h3>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
      <input type="number" name="availableSeats" placeholder="Available Seats" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <button onClick={createEvent}>Create Event</button>

      <h3>All Events</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Seats</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td>{event.availableSeats}</td>
              <td>${event.price}</td>
              <td>
                <button onClick={() => handleDelete(event._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventDashboard;
