import {
  loginController,
  registerController,
  logoutController,
  logoutAllController,
} from "./auth.controller.js";
import { validateLogin, validateRegister } from "./auth.validation.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);

// Protected routes (authentication required)
router.post("/logout", authenticateToken, logoutController);
router.post("/logout-all", authenticateToken, logoutAllController);

export default router;
