import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Generate 4-digit OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000);

// Helper: Send Email
const sendEmailOtp = async (email, otp) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2>Password Reset Request</h2>
        <p>Use the following OTP to reset your password. This code is valid for 5 minutes.</p>
        <h1 style="color: #4A90E2; letter-spacing: 5px;">${otp}</h1>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

const normalizeEmail = (email) => (email ? email.toLowerCase().trim() : "");

// --- CONTROLLERS ---

export const ForgetPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = normalizeEmail(email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    // Save OTP details directly to the User document
    user.Otp = Number(otp);
    user.OtpExpires = Date.now() + 5 * 60 * 1000; // 5 Minutes expiry
    user.OtpVerified = false;
    await user.save();

    await sendEmailOtp(email, otp);

    res.status(200).json({ message: "OTP sent to email successfully" });
  } catch (error) {
    console.error("ForgetPassword Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    email = normalizeEmail(email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    user.Otp = Number(otp);
    user.OtpExpires = Date.now() + 5 * 60 * 1000;
    user.OtpVerified = false;
    await user.save();

    await sendEmailOtp(email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("ResendOTP Error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = normalizeEmail(email);

    const user = await User.findOne({ email });

    if (!user || !user.Otp) {
      return res.status(400).json({ message: "No OTP request found for this email" });
    }

    // Check Expiry
    if (Date.now() > user.OtpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check Validity
    if (user.Otp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified in DB
    user.OtpVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("VerifyOtp Error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { email, password, confirmPassword } = req.body;
    email = normalizeEmail(email);

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Security Check: Ensure they actually verified the OTP first
    if (!user.OtpVerified) {
      return res.status(400).json({ message: "OTP not verified. Please verify first." });
    }

    console.log("otpcontroller.js / 154", password, confirmPassword);

    user.password = password;

    console.log("otpcontroller.js / 157", user.password);

    // Clear OTP fields so they can't be reused
    user.Otp = undefined;
    user.OtpExpires = undefined;
    user.OtpVerified = false;
    
    await user.save();

    console.log("otpcontroller.js / 167 password reset successful", user);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("ResetPassword Error:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

export default { ForgetPassword, resendOTP, verifyOtp, resetPassword };