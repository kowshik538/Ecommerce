import User from '../models/userModel.js';
import { sendOTPEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

export const requestOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'Email not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  user.resetOTP = otp;
  user.resetOTPExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  await sendOTPEmail(email, otp);
  res.json({ success: true, message: 'OTP sent to email' });
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successful' });
};
