import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const requestOtp = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password/request`, { email });
      if (res.data.success) {
        toast.success('OTP sent to email');
        setOtpSent(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/forgot-password/reset`, {
        email,
        otp,
        newPassword
      });
      if (res.data.success) {
        toast.success('Password reset successful');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white">
      <div className="bg-white/10 p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <label className="text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-white/10 border border-white/20 rounded"
        />

        {otpSent && (
          <>
            <label className="text-sm mb-1">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 bg-white/10 border border-white/20 rounded"
            />

            <label className="text-sm mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 bg-white/10 border border-white/20 rounded"
            />
          </>
        )}

        {!otpSent ? (
          <button onClick={requestOtp} className="w-full bg-white text-black py-2 rounded">
            Send OTP
          </button>
        ) : (
          <button onClick={resetPassword} className="w-full bg-white text-black py-2 rounded">
            Reset Password
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
