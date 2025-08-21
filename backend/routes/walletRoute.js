import express from 'express';
import { getWalletBalance, getWalletTransactions } from '../controllers/walletController.js';
import auth from '../middleware/auth.js';

const walletRouter = express.Router();

// Get wallet balance
walletRouter.get('/balance', auth, getWalletBalance);

// Get wallet transactions
walletRouter.get('/transactions', auth, getWalletTransactions);

export default walletRouter; 