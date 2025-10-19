import { loginController, registerController } from "./auth.controller.js";
import { validateEmail } from "./auth.validation.js";
import express from "express";

const router = express.Router();

router.post("/login", validateEmail, loginController);
router.post("/register", validateEmail, registerController);

export default router;
