// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LoginAdmin from './components/LoginAdmin';
import AdminRegister from './components/AdminRegister'; // Import AdminRegister
import Dashboard from './components/Dashboard';
import AddMovie from './components/AddMovie';
import EditMovie from './components/EditMovie';
import MovieDetail from './components/MovieDetail';
import LoginUser from './components/LoginUser';
import UserRegister from './components/UserRegister';
import UserDashboard from './components/UserDashboard';
import UserMovieDetail from './components/UserMovieDetail';

// Simple axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh when access token expires
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.get('http://localhost:3001/token', {
          withCredentials: true
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, just redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        window.location.href = '/login-user';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin routes */}
          <Route path="/login" element={<LoginAdmin />} />
          <Route path="/register-admin" element={<AdminRegister />} /> {/* New admin registration route */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-movie" element={<AddMovie />} />
          <Route path="/edit-movie/:id" element={<EditMovie />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          
          {/* User routes */}
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-movie/:id" element={<UserMovieDetail />} />
          
          {/* Redirect root to user login (or you can change this to admin) */}
          <Route path="/" element={<LoginUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;