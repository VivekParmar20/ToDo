// src/server.js
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/AuthRoutes');
const todoRoutes = require('./routes/TodoRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // For parsing cookies
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes); // Protect todo routes with auth middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

// Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
