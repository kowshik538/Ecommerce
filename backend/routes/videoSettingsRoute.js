import express from 'express';
import { getVideoSettings, updateVideoSettings } from '../controllers/videoSettingsController.js';
import adminAuth from '../middleware/adminAuth.js';

const videoSettingsRouter = express.Router();

// Get video settings (public)
videoSettingsRouter.get('/video-settings', getVideoSettings);

// Update video settings (admin only)
videoSettingsRouter.post('/update-video-settings', adminAuth, updateVideoSettings);

export default videoSettingsRouter; 