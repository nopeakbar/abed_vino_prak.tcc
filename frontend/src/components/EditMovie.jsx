import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditMovie = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get movie ID from URL
  const [formData, setFormData] = useState({
    name: '',
    director: '',
    release_date: '',
    genre: '',
    duration: '',
    synopsis: '',
    cast: '',
    poster: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Movies/${id}`);
        const movie = response.data;
        
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = movie.release_date ? movie.release_date.split('T')[0] : '';
        
        setFormData({
          name: movie.name || '',
          director: movie.director || '',
          release_date: formattedDate,
          genre: movie.genre || '',
          duration: movie.duration || '',
          synopsis: movie.synopsis || '',
          cast: movie.cast || '',
          poster: movie.poster || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie:', error);
        alert('Film tidak ditemukan');
        navigate('/dashboard');
      }
    };

    fetchMovie();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.patch(`http://localhost:3001/Movies/${id}`, {
        ...formData,
        duration: parseInt(formData.duration) // Convert to integer
      });
      
      alert('Film berhasil diperbarui!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Gagal memperbarui film. Silakan coba lagi.');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px' }}>
      <h1 className="title">Edit Film</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Judul Film</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Masukkan judul film"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Sutradara</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="director"
              placeholder="Masukkan nama sutradara"
              value={formData.director}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Tanggal Rilis</label>
              <div className="control">
                <input
                  className="input"
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="column">
            <div className="field">
              <label className="label">Durasi (menit)</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="duration"
                  placeholder="Contoh: 120"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Genre</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="genre"
              placeholder="Contoh: Drama, Action, Horror"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Pemeran</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="cast"
              placeholder="Masukkan nama-nama pemeran (pisahkan dengan koma)"
              value={formData.cast}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Sinopsis</label>
          <div className="control">
            <textarea
              className="textarea"
              name="synopsis"
              placeholder="Masukkan sinopsis film"
              rows="4"
              value={formData.synopsis}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="field">
          <label className="label">URL Poster</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="poster"
              placeholder="Contoh: /uploads/posters/namafilm.jpg"
              value={formData.poster}
              onChange={handleChange}
            />
          </div>
          <p className="help">Upload poster ke folder backend/public/uploads/posters/ terlebih dahulu</p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-primary">
              Update Film
            </button>
          </div>
          <div className="control">
            <button type="button" className="button is-light" onClick={handleCancel}>
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMovie;