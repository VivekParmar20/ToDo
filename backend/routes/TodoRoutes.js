const express = require('express');
const Todo = require('../models/Todo'); // Assuming Todo is your model for tasks
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all todos for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }); // Fetch todos for the logged-in user
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search todos by query
router.get('/search', authMiddleware, async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.trim() === "") {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const todos = await Todo.find({
      user: req.userId,
      title: { $regex: query, $options: 'i' }, // Case-insensitive search
    });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new todo
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  
  try {
    const newTodo = new Todo({
      title,
      description,
      user: req.userId, // Associate todo with the logged-in user
    });

    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todo
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.userId },
      { title, description },
      { new: true } // Return the updated todo
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or you do not have permission to edit it' });
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.userId });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or you do not have permission to delete it' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
