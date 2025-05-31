// ReviewController.js - Complete version with all CRUD operations
import Review from "../models/ReviewModel.js";
import User from "../models/UserModel.js";
import Movie from "../models/MovieModel.js";

// Get all reviews with user information
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: 'User', // Make sure this matches your association alias
          attributes: ['id', 'username'] // Only include needed fields
        },
        {
          model: Movie,
          as: 'Movie', // Optional: include movie data if needed
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']] // Show newest reviews first
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a specific movie
export const getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.findAll({
      where: { movieId: movieId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get review by ID
export const getReviewbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username']
        },
        {
          model: Movie,
          as: 'Movie',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { rating, review, userId, movieId } = req.body;
    
    // Validation
    if (!rating || !review || !userId || !movieId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      where: { userId: userId, movieId: movieId }
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }
    
    const newReview = await Review.create({
      rating,
      review,
      userId,
      movieId
    });
    
    // Return the review with user data
    const reviewWithUser = await Review.findByPk(newReview.id, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username']
        }
      ]
    });
    
    res.status(201).json(reviewWithUser);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, userId } = req.body;
    
    // Find the review
    const existingReview = await Review.findByPk(id);
    
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if the user owns this review (optional security check)
    if (userId && existingReview.userId !== userId) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }
    
    // Update the review
    await Review.update(
      { rating, review },
      { where: { id: id } }
    );
    
    // Return updated review with user data
    const updatedReview = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username']
        }
      ]
    });
    
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a review - Admin can delete any review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Admin attempting to delete review ${id}`);
    
    // Find the review
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Delete the review (no ownership check for admin)
    await Review.destroy({ where: { id: id } });
    
    console.log(`Review ${id} deleted successfully by admin`);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: error.message });
  }
};