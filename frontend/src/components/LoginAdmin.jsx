import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/loginAdmin', {
        email,
        password
      }, {
        withCredentials: true
      });

      const token = response.data.accessToken;
      localStorage.setItem('accessToken', token);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Login failed! Please check your email and password.');
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
          margin-bottom: 1rem;
        }
        .dark-button:disabled {
          background-color: #333;
          color: #666;
          cursor: not-allowed;
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
          margin-bottom: 0.5rem;
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
        .link-secondary {
          color: #888;
          text-decoration: none;
          cursor: pointer;
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
            Admin Login
          </h1>
          <p style={{ color: '#b0b0b0', fontSize: '1rem' }}>
            Welcome back! Please login to admin panel.
          </p>
        </div>

        <form onSubmit={handleLogin}>
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
            />
          </div>

          <button 
            className="dark-button"
            type="submit"
            disabled={loading}
          >
            {loading && <span className="loader"></span>}
            {loading ? 'Signing In...' : 'Login'}
          </button>

          <button 
            className="secondary-button"
            type="button"
            onClick={() => navigate('/login-user')}
          >
            Login as User
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>
              Don't have an admin account?{' '}
              <span 
                className="link"
                onClick={() => navigate('/register-admin')}
              >
                Register Admin
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;