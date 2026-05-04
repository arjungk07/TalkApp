import express from "express";
import upload from "../../middleware/upload.js";
import { uploadProfile } from "../../controllers/uploadController.js";

const router = express.Router();

// 🔥 IMPORTANT: "profile" must match frontend
router.post("/upload-profile", upload.single("profile"), uploadProfile);

export default router;
