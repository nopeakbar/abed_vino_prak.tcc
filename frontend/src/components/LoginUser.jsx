import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password
      }, {
        withCredentials: true // Important for cookies
      });

      if (response.data.status === 'Succes') {
        // Store access token in localStorage or context
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('userData', JSON.stringify(response.data.safeUserData));
        
        // Redirect to user dashboard or home page
        navigate('/user-dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
        .login-box {
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
          transform: none;
          box-shadow: none;
        }
        .secondary-button {
          background-color: #4a5568;
          color: #ffffff;
          border: 1px solid #666;
          border-radius: 20px;
          padding: 0.75rem 1rem;
          transition: all 0.2s ease;
          cursor: pointer;
          width: 100%;
          font-size: 1rem;
          margin-top: 1rem;
        }

        .error-box {
          background: #2a2a2a;
          border: 1px solid #e53e3e;
          color: #ffffff;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          position: relative;
        }
        .error-close {
          position: absolute;
          top: 0.5rem;
          right: 0.75rem;
          background: none;
          border: none;
          color: #e53e3e;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
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
      `}</style>

      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#ffffff',
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            User Login
          </h1>
          <p style={{ color: '#b0b0b0', fontSize: '1rem' }}>
            Welcome back! Please login to your account.
          </p>
        </div>

        {error && (
          <div className="error-box">
            <button className="error-close" onClick={() => setError('')}>
              ×
            </button>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label">Email</label>
            <input
              className="dark-input"
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            className="dark-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && <span className="loader"></span>}
            {isLoading ? 'Signing In...' : 'Login'}
          </button>

          <button 
            className="secondary-button"
            type="button"
            onClick={() => navigate('/login')}
          >
            Login as Admin
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <span 
                style={{ 
                  color: '#64ffda', 
                  cursor: 'pointer', 
                  fontWeight: '500',
                  textDecoration: 'underline'
                }}
                onClick={() => navigate('/register')}
              >
                Register here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginUser;