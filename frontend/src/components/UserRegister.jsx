import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation does not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/register', {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      console.log('Registration successful:', response.data);
      
      // Show success message
      alert('Registration successful! Please login with your account.');
      
      // Redirect to login page
      navigate('/login-user');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        // Server error message
        alert(`Registration failed: ${error.response.data.message}`);
      } else if (error.response?.status === 400) {
        alert('Invalid data entered. Please check your form.');
      } else if (error.response?.status === 409) {
        alert('Email already registered. Use a different email or login with existing account.');
      } else {
        alert('An error occurred during registration. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#121212', 
      minHeight: '100vh',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <style>{`
        .register-box {
          background: #1e1e1e;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 1px solid #333;
          width: 100%;
          max-width: 400px;
        }
        .dark-input {
          background-color: #2a2a2a !important;
          border: 1px solid #404040 !important;
          color: #ffffff !important;
          border-radius: 8px !important;
          padding: 0.75rem;
          width: 100%;
          font-size: 1rem;
          box-sizing: border-box;
        }
        .dark-input:focus {
          border-color: #64ffda !important;
          box-shadow: 0 0 0 0.125em rgba(100, 255, 218, 0.25) !important;
          outline: none;
        }
        .dark-input::placeholder {
          color: #888 !important;
        }
        .dark-input.error {
          border-color: #e53e3e !important;
        }
        .dark-button {
          background-color: #64ffda;
          color: #121212;
          border: none;
          border-radius: 25px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.2s ease;
          cursor: pointer;
          width: 100%;
          font-size: 1rem;
        }
        .dark-button:disabled {
          background-color: #333;
          color: #666;
          cursor: not-allowed;
        }
        .field {
          margin-bottom: 1.5rem;
        }
        .label {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
        }
        .error-text {
          color: #e53e3e;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: block;
        }
        .loader {
          border: 2px solid #333;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 0.5rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .link {
          color: #64ffda;
          text-decoration: none;
          font-weight: 500;
        }
        .link-secondary {
          color: #888;
          text-decoration: none;
        }
      `}</style>

      <div className="register-box">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            Create New Account
          </h1>
          <p style={{ color: '#b0b0b0', fontSize: '1rem' }}>
            Create an account to start reviewing movies
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="field">
            <label className="label">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className={`dark-input ${errors.username ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="field">
            <label className="label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`dark-input ${errors.email ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="field">
            <label className="label">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`dark-input ${errors.password ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="field">
            <label className="label">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`dark-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="dark-button"
          >
            {loading && <span className="loader"></span>}
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login-user" className="link">
                Login here
              </Link>
            </p>
          </div>

          {/* Admin Login Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #333'
          }}>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>
              Admin?{' '}
              <Link to="/login" className="link-secondary">
                Login as Admin
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;