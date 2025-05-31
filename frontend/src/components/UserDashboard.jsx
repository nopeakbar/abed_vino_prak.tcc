import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const [username, setUsername] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username || 'User');
    } catch (error) {
      console.error("Token tidak valid:", error);
      navigate('/login');
    }

    // Fetch movies
    fetchMovies();
  }, [navigate]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:3001/Movies');
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Change to user logout endpoint if different from admin
      await axios.delete('http://localhost:3001/logoutUser', {
        withCredentials: true
      });
      localStorage.removeItem('accessToken');
      navigate('/login-user');
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem('accessToken');
      navigate('/login-user');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => 
        movie.name.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term) ||
        movie.genre.toLowerCase().includes(term) ||
        movie.cast.toLowerCase().includes(term)
      );
      setFilteredMovies(filtered);
    }
  };

  const handleMovieClick = (id) => {
    navigate(`/user-movie/${id}`); // Changed from /movie/${id} to /user-movie/${id}
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <style>{`
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }
        
        @media (max-width: 1200px) {
          .movie-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      {/* Header Section */}
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <h1 className="title">Selamat datang, {username}!</h1>
          </div>
        </div>
        <div className="level-right">
          {/* Removed Add Movie button */}
          <div className="level-item">
            <button className="button is-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <h2 className="title is-4">Katalog Film</h2>
      
      {/* Search Bar */}
      <div className="field" style={{ marginBottom: '2rem' }}>
        <div className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="Cari film berdasarkan nama, sutradara, genre, atau pemeran..."
            value={searchTerm}
            onChange={handleSearch}
            style={{ maxWidth: '400px' }}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>
      
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <style jsx>{`
              @media (max-width: 1200px) {
                .column {
                  flex: 0 0 50% !important;
                  max-width: 50% !important;
                }
              }
            `}</style>
            <style jsx>{`
              @media (max-width: 1200px) {
                .column {
                  flex: 0 0 50% !important;
                  max-width: 50% !important;
                }
              }
            `}</style>
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div 
                className="card-image" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleMovieClick(movie.id)}
              >
                <figure className="image is-2by3">
                  <img 
                    src={movie.poster ? `http://localhost:3001${movie.poster}` : 'https://via.placeholder.com/200x300?text=No+Poster'} 
                    alt={movie.name}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x300?text=No+Poster';
                    }}
                  />
                </figure>
              </div>
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <p 
                    className="title is-6" 
                    style={{ marginBottom: '0.5rem', lineHeight: '1.2', cursor: 'pointer' }}
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    {movie.name} ({new Date(movie.release_date).getFullYear()})
                  </p>
                </div>
                {/* Removed Edit and Delete buttons */}
                {/* Users can only view movies, not edit/delete them */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && searchTerm && (
        <div className="notification is-warning">
          <p>Tidak ada film yang ditemukan untuk "{searchTerm}".</p>
        </div>
      )}

      {movies.length === 0 && (
        <div className="notification is-info">
          <p>Belum ada film yang ditambahkan.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;