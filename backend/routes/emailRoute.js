import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import {
    getAllUsers,
    getUsersByPreference,
    createEmailTemplate,
    getEmailTemplates,
    updateEmailTemplate,
    deleteEmailTemplate,
    sendEmailCampaign,
    getEmailCampaigns,
    getCampaignStats
} from '../controllers/emailController.js';

const emailRouter = express.Router();

// User management routes
emailRouter.get('/users', adminAuth, getAllUsers);
emailRouter.get('/users/preference', adminAuth, getUsersByPreference);

// Email template routes
emailRouter.post('/templates', adminAuth, createEmailTemplate);
emailRouter.get('/templates', adminAuth, getEmailTemplates);
emailRouter.put('/templates/:templateId', adminAuth, updateEmailTemplate);
emailRouter.delete('/templates/:templateId', adminAuth, deleteEmailTemplate);

// Email campaign routes
emailRouter.post('/campaigns/send', adminAuth, sendEmailCampaign);
emailRouter.get('/campaigns', adminAuth, getEmailCampaigns);
emailRouter.get('/campaigns/stats', adminAuth, getCampaignStats);

export default emailRouter; 