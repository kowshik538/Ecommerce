import express from 'express';
import { addReview, getProductReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const reviewRouter = express.Router();

// Get reviews for a product (public)
reviewRouter.get('/product/:productId', getProductReviews);

// Add a review (authenticated users only)
reviewRouter.post('/add', auth, addReview);

// Update a review (authenticated users only)
reviewRouter.put('/update', auth, updateReview);

// Delete a review (authenticated users only)
reviewRouter.delete('/:reviewId', auth, deleteReview);

export default reviewRouter; 