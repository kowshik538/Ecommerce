import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [backendUrl] = useState('http://localhost:4000');

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/wallet/balance`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setWalletBalance(response.data.balance);
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet transactions
  const fetchTransactions = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${backendUrl}/api/wallet/transactions`, {
        headers: { token }
      });
      
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Update balance after order cancellation
  const updateBalanceAfterCancellation = (amount) => {
    setWalletBalance(prev => prev + amount);
  };

  // Update balance after wallet payment
  const updateBalanceAfterPayment = (amount) => {
    setWalletBalance(prev => prev - amount);
  };

  useEffect(() => {
    if (token) {
      fetchWalletBalance();
    }
  }, [token]);

  const value = {
    walletBalance,
    transactions,
    loading,
    fetchWalletBalance,
    fetchTransactions,
    updateBalanceAfterCancellation,
    updateBalanceAfterPayment
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 