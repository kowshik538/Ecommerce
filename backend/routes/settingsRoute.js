import express from 'express';
import { getDeliveryFee, updateDeliveryFee } from '../controllers/settingsController.js';
import adminAuth from '../middleware/adminAuth.js';

const settingsRouter = express.Router();

// Get delivery fee (public)
settingsRouter.get('/delivery-fee', getDeliveryFee);

// Update delivery fee (admin only)
settingsRouter.post('/update-delivery-fee', adminAuth, updateDeliveryFee);

export default settingsRouter; 