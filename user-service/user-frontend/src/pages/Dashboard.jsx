import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({}); // Store selected ticket counts
  const navigate = useNavigate();

  // Fetch Bookings & Events on Page Load
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5001/bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5002/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchBookings();
    fetchEvents();
  }, []);

  // Handle ticket count change
  const handleTicketChange = (eventId, value) => {
    setTicketCounts({ ...ticketCounts, [eventId]: value });
  };

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Invalid or missing token:", error);
      return null;
    }
  };
  
  const createBooking = async (eventId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const decoded = decodeToken(token);
        if (!decoded || !decoded.userId) throw new Error("Invalid token format");

        const numTickets = ticketCounts[eventId] || 1; // Default to 1 if not selected
        // console.log("Decoded User ID:", decoded.userId);
        // console.log("Event ID:", eventId);
        // console.log("Number of Tickets:", numTickets);

        const res = await axios.post("http://localhost:5001/bookings", {
            userId: decoded.userId,
            eventId: eventId,
            numTickets: numTickets // Send the selected ticket count
        }, {
            headers: { Authorization: `Bearer ${token}` } // ✅ Send JWT in headers
        });

        setBookings([...bookings, res.data]);
    } catch (err) {
        console.error("Error creating booking:", err.message);
    }
  };

  return (
    <div>
      <h2>Booking Management Dashboard</h2>
      <button onClick={() => navigate("/login")}>Logout</button>

      <h3>Available Events</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Seats</th>
            <th>Price</th>
            <th>Tickets</th>
            <th>Book</th>
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
                <select
                  value={ticketCounts[event._id] || 1}
                  onChange={(e) => handleTicketChange(event._id, parseInt(e.target.value))}
                >
                  {[...Array(event.availableSeats > 10 ? 10 : event.availableSeats).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => createBooking(event._id)}>Book</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Your Bookings</h3>
      <table border="1">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Event ID</th>
            <th>Tickets</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.userId}</td>
              <td>{booking.eventId}</td>
              <td>{booking.numTickets}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDashboard;
