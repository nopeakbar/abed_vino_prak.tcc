import Movie from "../models/MovieModel.js";
import fs from "fs";
import path from "path";

export const getMovies = async (req, res) => {
  try {
    const response = await Movie.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getMoviebyId = async (req, res) => {
  try {
    const response = await Movie.findOne({
      where: {
        id: req.params.id
      }
    });
    
    if (!response) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    // Check if movie already exists
    const existingMovie = await Movie.findOne({
      where: { name: req.body.name }
    });
        
    if (existingMovie) {
      // If file was uploaded but movie creation failed, delete the uploaded file
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log('Error deleting uploaded file:', err);
        });
      }
      return res.status(400).json({
        message: "Movie with this name already exists!"
      });
    }

    // Prepare movie data
    const movieData = {
      name: req.body.name,
      director: req.body.director,
      release_date: req.body.release_date,
      genre: req.body.genre,
      duration: parseInt(req.body.duration),
      synopsis: req.body.synopsis,
      cast: req.body.cast,
      poster: req.file ? `/uploads/posters/${req.file.filename}` : null
    };

    await Movie.create(movieData);
    res.status(201).json({ 
      message: "Movie created successfully",
      poster: movieData.poster 
    });
  } catch (error) {
    // If movie creation failed and file was uploaded, delete the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log('Error deleting uploaded file:', err);
      });
    }
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    // First, find the existing movie to get the old poster path
    const existingMovie = await Movie.findOne({
      where: { id: req.params.id }
    });

    if (!existingMovie) {
      // If file was uploaded but movie not found, delete the uploaded file
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.log('Error deleting uploaded file:', err);
        });
      }
      return res.status(404).json({ message: "Movie not found" });
    }

    // Prepare update data
    const updateData = {
      name: req.body.name,
      director: req.body.director,
      release_date: req.body.release_date,
      genre: req.body.genre,
      duration: parseInt(req.body.duration),
      synopsis: req.body.synopsis,
      cast: req.body.cast
    };

    // If new poster is uploaded, add it to update data and delete old poster
    if (req.file) {
      updateData.poster = `/uploads/posters/${req.file.filename}`;
      
      // Delete old poster file if it exists
      if (existingMovie.poster) {
        const oldPosterPath = path.join(process.cwd(), 'public', existingMovie.poster);
        fs.unlink(oldPosterPath, (err) => {
          if (err) console.log('Error deleting old poster:', err);
        });
      }
    }

    await Movie.update(updateData, {
      where: { id: req.params.id }
    });

    res.status(200).json({ 
      message: "Movie updated successfully",
      poster: updateData.poster || existingMovie.poster
    });
  } catch (error) {
    // If update failed and file was uploaded, delete the uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.log('Error deleting uploaded file:', err);
      });
    }
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    // First, find the movie to get the poster path
    const movie = await Movie.findOne({
      where: { id: req.params.id }
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Delete the movie from database
    await Movie.destroy({
      where: { id: req.params.id }
    });

    // Delete the poster file if it exists
    if (movie.poster) {
      const posterPath = path.join(process.cwd(), 'public', movie.poster);
      fs.unlink(posterPath, (err) => {
        if (err) console.log('Error deleting poster file:', err);
      });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};