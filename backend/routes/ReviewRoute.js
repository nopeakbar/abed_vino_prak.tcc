// In your routes file (e.g., routes/ReviewRoute.js or index.js):

import express from "express";
import { 
  getReviews, 
  getReviewsByMovie, 
  getReviewbyId,
  createReview, 
  updateReview, 
  deleteReview 
} from "../controllers/ReviewController.js";

const router = express.Router();

// Add this route for getting reviews by movie
router.get('/reviews/movie/:movieId', getReviewsByMovie);

// Other routes
router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewbyId);
router.post('/reviews', createReview);
router.patch('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

export default router;