import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const UserMovieDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    review: ''
  });
  const [currentUserId, setCurrentUserId] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingReview, setEditingReview] = useState({
    rating: 5,
    review: ''
  });

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      console.log('Fetching reviews...');
      
      const response = await axios.get('http://localhost:3001/reviews', {
        timeout: 10000
      });
      
      console.log('All reviews data:', response.data);
      const movieReviews = response.data.filter(review => review.movieId === parseInt(id));
      console.log('Movie reviews:', movieReviews);
      console.log('Current user ID when filtering:', currentUserId);
      setReviews(movieReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, currentUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user ID from token
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.id || decoded.userId);
            console.log('Current user ID:', decoded.id || decoded.userId);
          } catch (error) {
            console.error('Error decoding token:', error);
          }
        }

        // Fetch movie - try both endpoints
        try {
          console.log('Fetching movie with ID:', id);
          const response = await axios.get(`http://localhost:3001/Movies/${id}`);
          console.log('Movie data received:', response.data);
          setMovie(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching movie:', error);
          
          // Try lowercase endpoint if uppercase fails
          try {
            const response = await axios.get(`http://localhost:3001/movies/${id}`);
            setMovie(response.data);
            setLoading(false);
          } catch (secondError) {
            console.error('Error with lowercase endpoint too:', secondError);
            setLoading(false);
            alert('Film tidak ditemukan');
            navigate('/user-dashboard');
            return;
          }
        }

        // Fetch reviews independently
        fetchReviews();
      } catch (error) {
        console.error('Unexpected error in fetchData:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, fetchReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUserId) {
      alert('Anda harus login untuk memberikan review');
      return;
    }
    if (!newReview.review.trim()) {
      alert('Mohon tulis review Anda');
      return;
    }

    setSubmittingReview(true);
    
    try {
      await axios.post('http://localhost:3001/reviews', {
        rating: newReview.rating,
        review: newReview.review,
        userId: currentUserId,
        movieId: parseInt(id)
      });
      
      // Reset form
      setNewReview({ rating: 5, review: '' });
      
      // Refresh reviews
      await fetchReviews();
      
      alert('Review berhasil ditambahkan!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Gagal mengirim review. Silakan coba lagi.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditingReview({
      rating: review.rating,
      review: review.review
    });
  };

  const handleEditCancel = () => {
    setEditingReviewId(null);
    setEditingReview({ rating: 5, review: '' });
  };

  const handleEditSubmit = async (reviewId) => {
    if (!editingReview.review.trim()) {
      alert('Review tidak boleh kosong');
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/reviews/${reviewId}`, {
        rating: editingReview.rating,
        review: editingReview.review,
        userId: currentUserId
      });

      // Refresh reviews
      await fetchReviews();
      
      // Reset editing state
      setEditingReviewId(null);
      setEditingReview({ rating: 5, review: '' });
      
      alert('Review berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Gagal mengupdate review. Silakan coba lagi.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus review ini?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/reviews/${reviewId}`, {
        data: { userId: currentUserId }
      });

      // Refresh reviews
      await fetchReviews();
      
      alert('Review berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Gagal menghapus review. Silakan coba lagi.');
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={interactive ? 'star-interactive' : 'star'}
          style={{
            color: i <= rating ? '#FFD700' : '#555',
            fontSize: '1.5rem',
            cursor: interactive ? 'pointer' : 'default',
            marginRight: '0.25rem',
            transition: 'color 0.2s'
          }}
          onClick={interactive ? () => onStarClick(i) : null}
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
        <p style={{ color: '#ffffff', fontSize: '1.2rem' }}>Film tidak ditemukan</p>
        <button 
          className="button mt-4" 
          onClick={() => navigate('/user-dashboard')}
          style={{
            backgroundColor: '#4a5568',
            color: '#ffffff',
            border: 'none',
            borderRadius: '25px',
            padding: '0.75rem 1.5rem',
            fontWeight: '500'
          }}
        >
          ← Kembali ke Dashboard
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
        .star-interactive:hover {
          transform: scale(1.2);
          transition: transform 0.1s ease;
          color: #FFD700 !important;
        }
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
        .dark-input {
          background-color: #2a2a2a !important;
          border: 1px solid #404040 !important;
          color: #ffffff !important;
          border-radius: 8px !important;
        }
        .dark-input:focus {
          border-color: #64ffda !important;
          box-shadow: 0 0 0 0.125em rgba(100, 255, 218, 0.25) !important;
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
        }
        .dark-button:hover {
          background-color: #4fd3b8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);
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
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        .secondary-button:hover {
          background-color: #2d3748;
          border-color: #64ffda;
        }
        .danger-button {
          background-color: #e53e3e;
          color: #ffffff;
          border: none;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        .danger-button:hover {
          background-color: #c53030;
        }
        .info-button {
          background-color: #3182ce;
          color: #ffffff;
          border: none;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }
        .info-button:hover {
          background-color: #2c5aa0;
        }
        .genre-tag {
          background-color: #64ffda;
          color: #121212;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-weight: 500;
          font-size: 0.9rem;
        }
      `}</style>
      
      <button 
        className="secondary-button mb-4"
        onClick={() => navigate('/user-dashboard')}
        style={{ marginBottom: '2rem' }}
      >
        ← Kembali ke Dashboard
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
            <h1 className="title is-2" style={{ 
              marginBottom: '1.5rem', 
              color: '#ffffff',
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              {movie.name}
            </h1>
            
            <div className="content">
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Director:</strong> 
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>{movie.director}</span>
              </div>
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Release Date:</strong> 
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>
                  {new Date(movie.release_date).toLocaleDateString('id-ID', {
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
                <span style={{ color: '#e0e0e0', marginLeft: '0.5rem' }}>{movie.duration} menit</span>
              </div>
              <div className="movie-info-item">
                <strong style={{ color: '#64ffda' }}>Casts:</strong> 
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
              {movie.synopsis || 'Tidak ada sinopsis tersedia.'}
            </p>
          </div>

          {/* Review Section */}
          <div className="movie-detail-box">
            <h2 className="subtitle is-4" style={{ 
              marginBottom: '1.5rem', 
              color: '#64ffda',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Review & Rating
            </h2>
            
            {/* Review Form */}
            {!reviews.some(review => review.userId === currentUserId) && (
              <div style={{ 
                background: '#2a2a2a', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                marginBottom: '2rem',
                border: '1px solid #404040'
              }}>
                <form onSubmit={handleReviewSubmit}>
                  <div className="field">
                    <label className="label" style={{ color: '#ffffff', fontSize: '1.1rem' }}>
                      Rating Anda
                    </label>
                    <div className="control">
                      {renderStars(newReview.rating, true, (rating) => 
                        setNewReview(prev => ({ ...prev, rating }))
                      )}
                      <span style={{ 
                        marginLeft: '1rem', 
                        fontSize: '1rem', 
                        color: '#b0b0b0' 
                      }}>
                        ({newReview.rating}/5)
                      </span>
                    </div>
                  </div>
                  
                  <div className="field">
                    <label className="label" style={{ color: '#ffffff', fontSize: '1.1rem' }}>
                      Review Anda
                    </label>
                    <div className="control">
                      <textarea
                        className="textarea dark-input"
                        placeholder="Tulis review Anda tentang film ini..."
                        value={newReview.review}
                        onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                        rows="4"
                        required
                        style={{ resize: 'vertical', fontSize: '1rem' }}
                      />
                    </div>
                  </div>
                  
                  <div className="field">
                    <div className="control">
                      <button 
                        type="submit" 
                        className={`dark-button ${submittingReview ? 'is-loading' : ''}`}
                        disabled={submittingReview}
                      >
                        {submittingReview ? 'Mengirim...' : 'Kirim Review'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h3 className="subtitle is-5" style={{ 
                marginBottom: '1rem',
                color: '#ffffff',
                fontSize: '1.3rem'
              }}>
                Review dari Pengguna 
                {reviewsLoading ? (
                  <span style={{ color: '#888' }}> (Loading...)</span>
                ) : (
                  <span style={{ color: '#888' }}> ({reviews.length})</span>
                )}
              </h3>
              
              {reviewsLoading ? (
                <p style={{ color: '#888' }}>Memuat review...</p>
              ) : reviews.length === 0 ? (
                <p style={{ 
                  color: '#888', 
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  Belum ada review untuk film ini. Jadilah yang pertama!
                </p>
              ) : (
                <div>
                  {reviews.map((review, index) => {
                    return (
                      <div key={review.id || index} className="review-item">
                        {editingReviewId === review.id ? (
                          // Edit Mode
                          <div>
                            <div className="field">
                              <label className="label" style={{ color: '#ffffff' }}>Rating</label>
                              <div className="control">
                                {renderStars(editingReview.rating, true, (rating) => 
                                  setEditingReview(prev => ({ ...prev, rating }))
                                )}
                                <span style={{ marginLeft: '1rem', fontSize: '0.9rem', color: '#b0b0b0' }}>
                                  ({editingReview.rating}/5)
                                </span>
                              </div>
                            </div>
                            
                            <div className="field">
                              <label className="label" style={{ color: '#ffffff' }}>Review</label>
                              <div className="control">
                                <textarea
                                  className="textarea dark-input"
                                  value={editingReview.review}
                                  onChange={(e) => setEditingReview(prev => ({ ...prev, review: e.target.value }))}
                                  rows="4"
                                />
                              </div>
                            </div>
                            
                            <div className="field is-grouped">
                              <div className="control">
                                <button 
                                  className="dark-button" 
                                  onClick={() => handleEditSubmit(review.id)}
                                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                >
                                  Simpan
                                </button>
                              </div>
                              <div className="control">
                                <button 
                                  className="secondary-button" 
                                  onClick={handleEditCancel}
                                  style={{ fontSize: '0.9rem' }}
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
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
                                  {new Date(review.createdAt).toLocaleDateString('id-ID')}
                                </small>
                                {review.userId === currentUserId && (
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                      className="info-button"
                                      onClick={() => handleEditClick(review)}
                                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      className="danger-button"
                                      onClick={() => handleDeleteReview(review.id)}
                                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                )}
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
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMovieDetail;