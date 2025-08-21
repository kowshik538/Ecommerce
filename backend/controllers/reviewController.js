import reviewModel from '../models/reviewModel.js';
import userModel from '../models/userModel.js';

// Add a review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.userId; // From auth middleware

        // Validate input
        if (!productId || !rating || !comment) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Get user details
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // Check if user already reviewed this product
        const existingReview = await reviewModel.findOne({ productId, userId });
        if (existingReview) {
            return res.json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        // Create new review
        const review = new reviewModel({
            productId,
            userId,
            userName: user.name,
            rating,
            comment
        });

        await review.save();

        res.json({
            success: true,
            message: "Review added successfully",
            review
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await reviewModel.find({ productId })
            .sort({ date: -1 }) // Latest first
            .limit(10); // Limit to 10 reviews

        // Calculate average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        res.json({
            success: true,
            reviews,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalReviews: reviews.length
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId, rating, comment } = req.body;
        const userId = req.userId;

        if (!rating || !comment) {
            return res.json({
                success: false,
                message: "Rating and comment are required"
            });
        }

        const review = await reviewModel.findOne({ _id: reviewId, userId });
        if (!review) {
            return res.json({
                success: false,
                message: "Review not found or unauthorized"
            });
        }

        review.rating = rating;
        review.comment = comment;
        review.date = Date.now();

        await review.save();

        res.json({
            success: true,
            message: "Review updated successfully",
            review
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.userId;

        const review = await reviewModel.findOneAndDelete({ _id: reviewId, userId });
        if (!review) {
            return res.json({
                success: false,
                message: "Review not found or unauthorized"
            });
        }

        res.json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};

export { addReview, getProductReviews, updateReview, deleteReview }; 