import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      console.log('Fetching reviews...');
      
      const response = await axios.get('http://localhost:3001/reviews', {
        timeout: 10000
      });
      
      console.log('Reviews data received:', response.data);
      const movieReviews = response.data.filter(review => review.movieId === parseInt(id));
      setReviews(movieReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movie
        const response = await axios.get(`http://localhost:3001/Movies/${id}`);
        setMovie(response.data);
        setLoading(false);
        
        // Fetch reviews
        fetchReviews();
      } catch (error) {
        console.error('Error fetching movie:', error);
        setLoading(false);
        alert('Movie not found');
        navigate('/dashboard');
      }
    };
    fetchData();
  }, [id, navigate, fetchReviews]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await axios.delete(`http://localhost:3001/Movies/${id}`);
        alert('Movie successfully deleted');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Failed to delete movie');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    console.log('Attempting to delete review:', reviewId);
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        console.log('Sending DELETE request to:', `http://localhost:3001/reviews/${reviewId}`);
        
        const response = await axios.delete(`http://localhost:3001/reviews/${reviewId}`);
        
        console.log('Delete response:', response);
        alert('Review successfully deleted');
        await fetchReviews(); // Refresh the reviews list
      } catch (error) {
        console.error('Full error object:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          alert(`Failed to delete review: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          alert('Failed to delete review: No response from server');
        } else {
          console.error('Request error:', error.message);
          alert('Failed to delete review: Request failed');
        }
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-movie/${id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className="star"
          style={{
            color: i <= rating ? '#FFD700' : '#555',
            fontSize: '1.5rem',
            cursor: 'default',
            marginRight: '0.25rem',
            userSelect: 'none'
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container" style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: '#121212', 
        minHeight: '100vh',
        color: '#ffffff'
      }}>
        <div className="loader"></div>
        <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container" style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        backgroundColor: '#121212', 
        minHeight: '100vh',
        color: '#ffffff'
      }}>
        <p style={{ color: '#ffffff', fontSize: '1.2rem' }}>Movie not found</p>
        <button 
          className="button mt-4" 
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#4a5568',
            color: '#ffffff',
            border: 'none',
            borderRadius: '25px',
            padding: '0.75rem 1.5rem',
            fontWeight: '500'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ 
      padding: '2rem', 
      backgroundColor: '#121212', 
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <style>{`
        .star {
          user-select: none;
        }
        .movie-detail-box {
          background: #1e1e1e;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
          border: 1px solid #333;
        }
        .review-item {
          background: #2a2a2a;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border: 1px solid #404040;
          transition: background-color 0.2s ease;
        }
        .review-item:hover {
          background: #2f2f2f;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .loader {
          border: 3px solid #333;
          border-top: 3px solid #64ffda;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .movie-info-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid #333;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .movie-info-item:last-child {
          border-bottom: none;
        }
        .poster-container {
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          border: 2px solid #333;
        }
        .secondary-button {
          background-color: #4a5568;
          color: #ffffff;
          border: 1px solid #666;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        .primary-button {
          background-color: #64ffda;
          color: #121212;
          border: none;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
          cursor: pointer;
          margin-right: 0.5rem;
          font-weight: 600;
        }
        .danger-button {
          background-color: #e53e3e;
          color: #ffffff;
          border: none;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
          cursor: pointer;
          font-weight: 500;
        }
        .danger-button:hover {
          background-color: #c53030;
        }
        .admin-notice {
          background: #2a2a2a;
          border: 1px solid #64ffda;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          color: #e0e0e0;
        }
        .admin-notice strong {
          color: #64ffda;
        }
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
      
      <button 
        className="secondary-button mb-4"
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '2rem' }}
      >
        ← Back to Dashboard
      </button>

      <div className="columns is-gap-8">
        <div className="column is-4">
          <div className="poster-container">
            <figure className="image">
              <img 
                src={movie.poster ? `http://localhost:3001${movie.poster}` : 'https://via.placeholder.com/400x600/333/fff?text=No+Poster'} 
                alt={movie.name}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/333/fff?text=No+Poster';
                }}
              />
            </figure>
          </div>
        </div>

        <div className="column is-8">
          <div className="movie-detail-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h1 className="title is-2" style={{ 
                color: '#ffffff',
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: 0
              }}>
                {movie.name}
              </h1>
              <div className="action-buttons">
                <button 
                  className="primary-button"
                  onClick={handleEdit}
                >
                  Edit Movie
                </button>
                <button 
                  className="danger-button"
                  onClick={handleDelete}
                >
                  Delete Movie
                </button>
              </div>
            </div>
            
            <div className="content">
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Director:</strong> 
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>{movie.director}</span>
              </div>
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Release Date:</strong> 
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Genre:</strong> 
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>{movie.genre}</span>
              </div>
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Duration:</strong> 
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>{movie.duration} minutes</span>
              </div>
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Cast:</strong> 
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>{movie.cast}</span>
              </div>
            </div>
          </div>

          <div className="movie-detail-box">
            <h2 className="subtitle is-4" style={{ 
              marginBottom: '1rem', 
              color: '#64ffda',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Synopsis
            </h2>
            <p style={{ 
              lineHeight: '1.8', 
              color: '#e0e0e0',
              fontSize: '1.1rem'
            }}>
              {movie.synopsis || 'No synopsis available.'}
            </p>
          </div>

          {/* Review Section - Admin View */}
          <div className="movie-detail-box">
            <h2 className="subtitle is-4" style={{ 
              marginBottom: '1.5rem', 
              color: '#64ffda',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              User Reviews & Ratings
            </h2>
            
            {/* Admin Notice */}
            <div className="admin-notice">
              <p>
                <strong>Admin Mode:</strong> You can view all reviews and delete them if necessary. Only users can add new reviews.
              </p>
            </div>
            
            {/* Reviews List */}
            <div>
              <h3 className="subtitle is-5" style={{ 
                marginBottom: '1rem',
                color: '#ffffff',
                fontSize: '1.3rem'
              }}>
                User Reviews
                {reviewsLoading ? (
                  <span style={{ color: '#888' }}> (Loading...)</span>
                ) : (
                  <span style={{ color: '#888' }}> ({reviews.length})</span>
                )}
              </h3>
              
              {reviewsLoading ? (
                <p style={{ color: '#888' }}>Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p style={{ 
                  color: '#888', 
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  No reviews for this movie yet.
                </p>
              ) : (
                <div>
                  {reviews.map((review, index) => (
                    <div key={review.id || index} className="review-item">
                      <div className="review-header">
                        <div>
                          <div style={{ marginBottom: '0.5rem' }}>
                            {renderStars(review.rating)}
                            <span style={{ marginLeft: '0.5rem', fontSize: '1rem', color: '#b0b0b0' }}>
                              ({review.rating}/5)
                            </span>
                          </div>
                          <p style={{ 
                            fontWeight: '600', 
                            color: '#ffffff',
                            fontSize: '1.1rem'
                          }}>
                            {review.User?.username || review.user?.username || 'Anonymous User'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <small style={{ color: '#888' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-US')}
                          </small>
                          <button 
                            className="danger-button"
                            onClick={() => handleDeleteReview(review.id)}
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="content">
                        <p style={{ 
                          marginBottom: 0, 
                          lineHeight: '1.6',
                          color: '#e0e0e0',
                          fontSize: '1rem'
                        }}>
                          {review.review}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;