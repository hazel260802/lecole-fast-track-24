import express from "express";
import * as authController from "../controllers/auth.js"; // Import auth controller
import { authorization } from "../middlewares/authorization.js"; // Import the authorization middleware

const router = express.Router();

// Get all users route 
router.get("/users", authorization, authController.getAllUsers);

// Register route
router.post("/register", authController.registerUser);

// Login route
router.post("/login", authController.loginUser);

// Logout route
router.post("/logout", authorization, authController.logoutUser);

// Update secret phrase route (admin or user themselves only)
router.post("/update-secret-phrase", authorization, authController.updateSecretPhrase);

export default router;