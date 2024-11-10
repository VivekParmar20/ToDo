const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;
  
  try {
    const task = new Task({ title, description });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getTasks, createTask, deleteTask };
