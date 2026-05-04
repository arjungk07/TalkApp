import express from "express";
const router = express.Router();
import { getUsers, getMe } from "../controllers/userController.js";
import protect from "../middleware/auth.js";

router.get("/", protect, getUsers);
router.get("/me", protect, getMe);

export default router;
