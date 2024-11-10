// src/routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User is your model for user data
const router = express.Router();

// Register Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  
  const existingUser = await User.findOne({ email });
  console.log(email, password, existingUser);
  
  if (existingUser && existingUser != null) {
      console.log("existingUser");
    return res.status(400).json({ message: 'User already exists' });
  }
console.log("bahar");

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7h', // Token expires in 1 hour
  });

  // Set token in cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set secure flag in production
  });

  res.status(200).json({ message: 'Login successful', token: token });
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

// Check if user is authenticated
router.get('/check', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }
  
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      res.json({ isAuthenticated: true });
    } catch (error) {
      res.json({ isAuthenticated: false });
    }
  });
module.exports = router;
