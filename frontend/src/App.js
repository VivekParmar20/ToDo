import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TodoPage from './pages/TodoPage';
import './App.css'; // Ensure the styles are imported

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if token exists on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // No token, user is logged out
    }
  }, []);

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div>
      <nav>
        {/* Using NavLink for active styling */}
        

        {/* Conditionally render the Todos link if the user is logged in */}
        {isLoggedIn ? <>
          <NavLink 
            to="/todos" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Todos
          </NavLink>
          </>
          : <>
          <NavLink 
          to="/login" 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Login
        </NavLink>
        <NavLink 
          to="/signup" 
          className={({ isActive }) => isActive ? 'active' : ''}
        >
          Sign Up
        </NavLink></>
        }

        {/* Conditionally render the logout button if the user is logged in */}
        {isLoggedIn && (
          <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </nav>

      <Routes>
        {/* Conditional routing */}
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </>
        ) : (
          <Route path="/todos" element={<TodoPage />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
