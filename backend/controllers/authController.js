// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token in cookies
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signUp, login };
