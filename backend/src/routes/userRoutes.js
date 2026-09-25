import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getProfile,
  getUsers,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Refresh Access Token
router.post("/refresh-token", refreshToken);

// Logout
router.post("/logout", logoutUser);

// Profile
router.get("/profile", protect, getProfile);

// All Users
router.get("/", getUsers);

export default router;