import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Invalid or missing token:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:5004/users/login", formData);
        const token = res.data.token;

        // Ensure token is a valid JWT
        if (!token || token.split(".").length !== 3) {
            throw new Error("Invalid token received");
        }

        const decoded = decodeToken(token);
        if (!decoded || !decoded.type) throw new Error("Invalid token format");
        console.log(decoded.type);

        localStorage.setItem("token", token);
        if (decoded.type === "admin") {
            navigate("/event-dashboard");
        } else if (decoded.type === "customer") {
            navigate("/dashboard");
        }
    } catch (err) {
        setError(err.response?.data?.error || "Login failed");
    }
  };


  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Signup</a></p>
    </div>
  );
};

export default Login;
