import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    registerUsername: "",
    registerPassword: "",
    loginUsername: "",
    loginPassword: ""
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [protectedText, setProtectedText] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem("savedUser") || "");

  const backendUrl = "https://task38-5t88.onrender.com";

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    // Simple validation first.
    if (!formData.registerUsername || !formData.registerPassword) {
      setStatusMessage("Please fill register form properly");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.registerUsername,
          password: formData.registerPassword
        })
      });

      const data = await response.json();
      setStatusMessage(data.message);

      if (response.ok) {
        setFormData({
          ...formData,
          registerUsername: "",
          registerPassword: ""
        });
      }
    } catch (error) {
      setStatusMessage("Something went wrong in register");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.loginUsername || !formData.loginPassword) {
      setStatusMessage("Please fill login form properly");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.loginUsername,
          password: formData.loginPassword
        })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("savedUser", formData.loginUsername);
        setLoggedInUser(formData.loginUsername);
      }

      setStatusMessage(data.message);
    } catch (error) {
      setStatusMessage("Something went wrong in login");
    }
  };

  const getProtectedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setProtectedText("Please login first");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("savedUser");
        setLoggedInUser("");
        setProtectedText("Session ended. Please login again");
        setStatusMessage("Token expired or invalid");
        return;
      }

      const data = await response.json();

      if (data.message) {
        setProtectedText(data.message);
      } else {
        setProtectedText("Could not load protected data");
      }
    } catch (error) {
      setProtectedText("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("savedUser");
    setLoggedInUser("");
    setProtectedText("");
    setStatusMessage("Logged out successfully");
  };

  return (
    <div className="container">
      <h1>JWT Authentication</h1>
      <p className="small-text">Simple student project using React, Express, MongoDB and JWT.</p>

      <div className="box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="registerUsername"
            placeholder="Enter username"
            value={formData.registerUsername}
            onChange={handleChange}
          />
          <input
            type="password"
            name="registerPassword"
            placeholder="Enter password"
            value={formData.registerPassword}
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </form>
      </div>

      <div className="box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="loginUsername"
            placeholder="Enter username"
            value={formData.loginUsername}
            onChange={handleChange}
          />
          <input
            type="password"
            name="loginPassword"
            placeholder="Enter password"
            value={formData.loginPassword}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="box">
        <h2>Protected Route</h2>
        {loggedInUser && <p className="user-line">Logged in as: {loggedInUser}</p>}
        <button onClick={getProtectedData}>Get Protected Data</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        {protectedText && <p>{protectedText}</p>}
      </div>

      {statusMessage && <p className="message">{statusMessage}</p>}
    </div>
  );
}

export default App;
