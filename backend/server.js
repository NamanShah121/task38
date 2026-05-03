const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Token not found" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  try {
    const oldUser = await User.findOne({ username: username });

    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("register error", error.message);
    res.status(500).json({ message: "Error while registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: "1h"
    });

    res.json({
      message: "Login successful",
      token: token,
      username: user.username
    });
  } catch (error) {
    console.log("login error", error.message);
    res.status(500).json({ message: "Error while logging in" });
  }
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are allowed to see this protected data",
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
