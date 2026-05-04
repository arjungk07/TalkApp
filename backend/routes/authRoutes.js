import express from "express";
const router = express.Router();
import { register, login, logout } from "../controllers/authController.js";
import { ForgetPassword, resendOTP, verifyOtp, resetPassword } from "../controllers/OtpController.js";



router.post("/register", register); 
router.post("/login", login);
router.delete("/logout/:id", logout);
router.post("/send-otp", ForgetPassword);
router.post("/resent-otp", resendOTP);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);


export default router;
