import walletModel from '../models/walletModel.js';
import userModel from '../models/userModel.js';

// Get or create wallet for user
const getOrCreateWallet = async (userId) => {
  let wallet = await walletModel.findOne({ userId });
  if (!wallet) {
    wallet = new walletModel({ userId, balance: 0 });
    await wallet.save();
  }
  return wallet;
};

// Add money to wallet from cancelled order
const addToWalletFromCancellation = async (userId, amount, orderId) => {
  try {
    const wallet = await getOrCreateWallet(userId);
    
    // Add transaction record
    wallet.transactions.push({
      type: 'credit',
      amount: amount,
      description: `Order cancellation refund - Order #${orderId}`,
      orderId: orderId
    });
    
    // Update balance
    wallet.balance += amount;
    await wallet.save();
    
    return { success: true, newBalance: wallet.balance };
  } catch (error) {
    console.error('Error adding to wallet:', error);
    return { success: false, error: error.message };
  }
};

// Get wallet balance
const getWalletBalance = async (req, res) => {
  try {
    const userId = req.userId;
    const wallet = await getOrCreateWallet(userId);
    
    res.json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions.slice(-10) // Last 10 transactions
    });
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    res.json({ success: false, message: error.message });
  }
};

// Use wallet balance for payment
const useWalletBalance = async (userId, amount) => {
  try {
    const wallet = await getOrCreateWallet(userId);
    
    if (wallet.balance < amount) {
      return { success: false, message: 'Insufficient wallet balance' };
    }
    
    // Add debit transaction
    wallet.transactions.push({
      type: 'debit',
      amount: amount,
      description: `Wallet payment for order`,
      date: new Date()
    });
    
    // Update balance
    wallet.balance -= amount;
    await wallet.save();
    
    return { success: true, newBalance: wallet.balance };
  } catch (error) {
    console.error('Error using wallet balance:', error);
    return { success: false, error: error.message };
  }
};

// Get wallet transactions
const getWalletTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const wallet = await getOrCreateWallet(userId);
    
    res.json({
      success: true,
      transactions: wallet.transactions.sort((a, b) => b.date - a.date)
    });
  } catch (error) {
    console.error('Error getting wallet transactions:', error);
    res.json({ success: false, message: error.message });
  }
};

export {
  getOrCreateWallet,
  addToWalletFromCancellation,
  getWalletBalance,
  useWalletBalance,
  getWalletTransactions
}; 