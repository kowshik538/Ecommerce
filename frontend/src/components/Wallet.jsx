import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet as WalletIcon, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Wallet = () => {
  const { walletBalance, transactions, loading, fetchTransactions } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <WalletIcon className="w-8 h-8 text-gray-600" />
            <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
          </div>
          
          {/* Balance Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-gray-800">{formatAmount(walletBalance)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'text-gray-600 border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">💡 How it works</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• When you cancel an online payment order, the amount goes to your wallet</li>
                  <li>• You can use wallet balance to pay for new orders</li>
                  <li>• Wallet balance can be used for orders of any amount</li>
                  <li>• No refunds are processed - all cancelled amounts stay in wallet</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">Credits</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    Money added from cancelled orders
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ArrowUpRight className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">Debits</h3>
                  </div>
                  <p className="text-sm text-orange-700">
                    Money spent on new orders
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <WalletIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatAmount(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet; 