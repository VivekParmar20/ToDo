import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('https://todo-7gti.onrender.com/api/auth/login', { email, password });
      // Save the token in localStorage (or sessionStorage)
      localStorage.setItem('token', response.data.token);  // Assuming the server returns the token
      alert('Login successful');
      navigate('/todos');
      window.location.reload();
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;
