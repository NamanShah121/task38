import { useState } from "react";

function App() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const [protectedMessage, setProtectedMessage] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("savedUser") || "");

  const backendUrl = "https://task38-5t88.onrender.com";

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerUsername === "" || registerPassword === "") {
      setMessage("Fill register fields");
      return;
    }

    try {
      console.log("register button clicked");

      const response = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword
        })
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setRegisterUsername("");
        setRegisterPassword("");
      }
    } catch (error) {
      console.log(error);
      setMessage("Register not working");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginUsername === "" || loginPassword === "") {
      setMessage("Fill login fields");
      return;
    }

    try {
      console.log("login button clicked");

      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword
        })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("savedUser", data.username);
        setUserName(data.username);
      }

      setMessage(data.message);
    } catch (error) {
      console.log(error);
      setMessage("Login not working");
    }
  };

  const handleProtected = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setProtectedMessage("Login first");
      return;
    }

    try {
      console.log("protected route button clicked");

      const response = await fetch(`${backendUrl}/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("savedUser");
        setUserName("");
        setProtectedMessage("Login again");
        setMessage("Token expired");
        return;
      }

      const data = await response.json();

      if (data.message) {
        setProtectedMessage(data.message);
      } else {
        setProtectedMessage("No data found");
      }
    } catch (error) {
      console.log(error);
      setProtectedMessage("Protected route not working");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("savedUser");
    setUserName("");
    setProtectedMessage("");
    setMessage("Logged out");
  };

  return (
    <div className="container">
      <h1>JWT Authentication</h1>

      <div className="box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter username"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
      </div>

      <div className="box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="box">
        <h2>Protected Route</h2>
        {userName !== "" && <p>Logged in user: {userName}</p>}
        <button onClick={handleProtected}>Get Protected Data</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        {protectedMessage !== "" && <p>{protectedMessage}</p>}
      </div>

      {message !== "" && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
