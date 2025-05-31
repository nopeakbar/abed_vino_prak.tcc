import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post('http://localhost:3001/registerAdmin', {
        username,
        email,
        password
      });
      
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Registration failed! ' + (error.response?.data?.message || 'Try again.'));
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
          cursor: pointer;
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
            Admin Register
          </h1>
          <p style={{ color: '#b0b0b0', fontSize: '1rem' }}>
            Create an admin account to manage the platform
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="field">
            <label className="label">Username</label>
            <input
              className="dark-input"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">Email</label>
            <input
              className="dark-input"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">Password</label>
            <input
              className="dark-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="field">
            <label className="label">Confirm Password</label>
            <input
              className="dark-input"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button 
            className="dark-button" 
            type="submit"
            disabled={loading}
          >
            {loading && <span className="loader"></span>}
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <span 
                className="link"
                onClick={() => navigate('/login')}
              >
                Login here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;