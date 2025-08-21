import nodemailer from 'nodemailer';
import pkg from 'nodemailer'; // Optional depending on version

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Ordan" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Ordan" <${process.env.SMTP_EMAIL}>`,
    to: to,
    subject: subject,
    html: html,
    text: text || html, // Fallback to html if text is not provided
  };

  await transporter.sendMail(mailOptions);
};
