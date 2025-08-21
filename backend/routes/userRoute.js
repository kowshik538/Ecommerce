import express from 'express';
import { 
    loginUser, 
    registerUser, 
    adminLogin, 
    getUserProfile, 
    updateUserProfile, 
    uploadProfilePhoto, 
    changePassword, 
    deleteAccount 
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import multer from '../middleware/multer.js';

const userRouter = express.Router();

import { requestOTP, resetPassword } from '../controllers/forgotPasswordController.js';

// Authentication routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Password reset routes
userRouter.post('/forgot-password/request', requestOTP);
userRouter.post('/forgot-password/reset', resetPassword);

// Profile management routes (authenticated)
userRouter.get('/profile', auth, getUserProfile);
userRouter.put('/profile', auth, updateUserProfile);
userRouter.post('/profile/photo', auth, multer.single('profilePhoto'), uploadProfilePhoto);
userRouter.put('/change-password', auth, changePassword);
userRouter.delete('/delete-account', auth, deleteAccount);

export default userRouter;