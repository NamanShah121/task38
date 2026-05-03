import { useState } from "react";

function App() {
  const [registerData, setRegisterData] = useState({
    username: "",
    password: ""
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [protectedMessage, setProtectedMessage] = useState("");

  const backendUrl = "http://localhost:5000";

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  const getProtectedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setProtectedMessage("Please login first");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.message) {
        setProtectedMessage(data.message);
      } else {
        setProtectedMessage("Could not load protected data");
      }
    } catch (error) {
      setProtectedMessage("Something went wrong");
    }
  };

  return (
    <div className="container">
      <h1>JWT Authentication</h1>

      <div className="box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={registerData.username}
            onChange={handleRegisterChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={registerData.password}
            onChange={handleRegisterChange}
          />
          <button type="submit">Register</button>
        </form>
      </div>

      <div className="box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={loginData.username}
            onChange={handleLoginChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={loginData.password}
            onChange={handleLoginChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="box">
        <h2>Protected Route</h2>
        <button onClick={getProtectedData}>Get Protected Data</button>
        {protectedMessage && <p>{protectedMessage}</p>}
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;

