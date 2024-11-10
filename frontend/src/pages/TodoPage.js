import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import Logout from '../components/Logout';
import '../App.css';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found, please log in.");
      return;
    }

    const fetchTodos = async () => {
      const url = searchTerm
        ? `https://todo-7gti.onrender.com/api/todos/search?query=${searchTerm}`
        : 'https://todo-7gti.onrender.com/api/todos';

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [searchTerm]);

  const addTodo = async (newTodo) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. User might not be authenticated.");
      return;
    }

    try {
      const response = await axios.post('https://todo-7gti.onrender.com/api/todos', newTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateTodo = async (updatedTodo) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. User might not be authenticated.");
      return;
    }

    try {
      const response = await axios.put(`https://todo-7gti.onrender.com/api/todos/${updatedTodo._id}`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.map(todo => (todo._id === updatedTodo._id ? response.data : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found. User might not be authenticated.");
      return;
    }

    try {
      await axios.delete(`https://todo-7gti.onrender.com/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="todo-page">
      <h1>To-Do List</h1>
      <input 
        className="search-bar"
        placeholder="Search todos" 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <TodoForm addTodo={addTodo} />
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
      ))}
      <Logout />
    </div>
  );
}

export default TodoPage;
