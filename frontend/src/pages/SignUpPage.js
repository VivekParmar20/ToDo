import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function SignUpPage() {
  const navigate = useNavigate();

  const handleRegister = async (email, password) => {
    try {
      const response = await axios.post('https://todo-7gti.onrender.com/api/auth/signup', { email, password });
      // Optionally store the token right after sign-up
      // localStorage.setItem('token', response.data.token);  // Assuming the server returns the token
      alert('Sign up successful');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      alert('User already exists');
    }
  };

  return (
    <div className="signup-page">
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
}

export default SignUpPage;
