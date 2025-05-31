import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    director: '',
    release_date: '',
    genre: '',
    duration: '',
    synopsis: '',
    cast: ''
  });
  
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setPosterFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Convert duration to integer
      submitData.set('duration', parseInt(formData.duration));
      
      // Append poster file if selected
      if (posterFile) {
        submitData.append('poster', posterFile);
      }
      
      await axios.post('http://localhost:3001/Movies', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Movie successfully added!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding movie:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to add movie. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
    // Clear file input
    const fileInput = document.getElementById('poster-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      padding: '2rem 1rem'
    }}>
      <style>{`
        .form-container {
          background: #1e1e1e;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          padding: 2.5rem;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #333;
        }
        .custom-input {
          border: 1px solid #404040;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 16px;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
          background: #2a2a2a;
          color: #ffffff;
        }
        .custom-input:focus {
          outline: none;
          border-color: #64ffda;
          box-shadow: 0 0 0 0.125em rgba(100, 255, 218, 0.25);
        }
        .custom-input::placeholder {
          color: #888;
        }
        .custom-textarea {
          border: 1px solid #404040;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 16px;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
          resize: vertical;
          min-height: 100px;
          background: #2a2a2a;
          color: #ffffff;
        }
        .custom-textarea:focus {
          outline: none;
          border-color: #64ffda;
          box-shadow: 0 0 0 0.125em rgba(100, 255, 218, 0.25);
        }
        .custom-textarea::placeholder {
          color: #888;
        }
        .custom-label {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
          display: block;
          font-size: 14px;
        }
        .field-group {
          margin-bottom: 1.5rem;
        }
        .primary-btn {
          background-color: #64ffda;
          color: #121212;
          border: none;
          border-radius: 25px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 12px;
        }
        .primary-btn:hover {
          background-color: #4fd1c7;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(100, 255, 218, 0.3);
        }
        .secondary-btn {
          background-color: #4a5568;
          color: #ffffff;
          border: 1px solid #666;
          border-radius: 20px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .secondary-btn:hover {
          background-color: #5a6578;
          border-color: #777;
        }
        .danger-btn {
          background-color: #e53e3e;
          color: #ffffff;
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .danger-btn:hover {
          background-color: #c53030;
        }
        .help-text {
          font-size: 12px;
          color: #888;
          margin-top: 4px;
        }
        .title-main {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 2rem;
          text-align: center;
        }
        .form-row {
          display: flex;
          gap: 1rem;
        }
        .form-col {
          flex: 1;
        }
        .file-upload-area {
          border: 2px dashed #404040;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          background: #2a2a2a;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .file-upload-area:hover {
          border-color: #64ffda;
          background: #333;
        }
        .file-upload-area.has-file {
          border-color: #64ffda;
          background: #2a3a3a;
        }
        .preview-container {
          position: relative;
          display: inline-block;
          margin-top: 1rem;
        }
        .preview-image {
          max-width: 200px;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .remove-btn {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .file-input {
          display: none;
        }
        .upload-text {
          color: #64ffda;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .upload-subtext {
          color: #888;
          font-size: 14px;
        }
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>
      
      <div className="form-container">
        <h1 className="title-main">Add New Movie</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="custom-label">Movie Title</label>
            <input
              className="custom-input"
              type="text"
              name="name"
              placeholder="Enter movie title"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="custom-label">Director</label>
            <input
              className="custom-input"
              type="text"
              name="director"
              placeholder="Enter director name"
              value={formData.director}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="field-group">
                <label className="custom-label">Release Date</label>
                <input
                  className="custom-input"
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-col">
              <div className="field-group">
                <label className="custom-label">Duration (minutes)</label>
                <input
                  className="custom-input"
                  type="number"
                  name="duration"
                  placeholder="Example: 120"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="field-group">
            <label className="custom-label">Genre</label>
            <input
              className="custom-input"
              type="text"
              name="genre"
              placeholder="Example: Drama, Action, Horror"
              value={formData.genre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="custom-label">Cast</label>
            <input
              className="custom-input"
              type="text"
              name="cast"
              placeholder="Enter cast names (separated by commas)"
              value={formData.cast}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label className="custom-label">Synopsis</label>
            <textarea
              className="custom-textarea"
              name="synopsis"
              placeholder="Enter movie synopsis"
              value={formData.synopsis}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="field-group">
            <label className="custom-label">Movie Poster</label>
            <div 
              className={`file-upload-area ${posterFile ? 'has-file' : ''}`}
              onClick={() => document.getElementById('poster-input').click()}
            >
              <input
                id="poster-input"
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {!posterPreview ? (
                <div>
                  <div className="upload-text">Click to upload poster</div>
                  <div className="upload-subtext">PNG, JPG, GIF up to 5MB</div>
                </div>
              ) : (
                <div className="preview-container">
                  <img 
                    src={posterPreview} 
                    alt="Poster preview" 
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePoster();
                    }}
                    title="Remove poster"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="help-text">
              {posterFile ? `Selected: ${posterFile.name}` : 'No file selected'}
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '12px', 
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            <button type="submit" className="primary-btn">
              Add Movie
            </button>
            <button type="button" className="secondary-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;