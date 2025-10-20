import { loginController, registerController } from "./auth.controller.js";
import { validateLogin, validateRegister } from "./auth.validation.js";
import express from "express";

const router = express.Router();

router.post("/login", validateLogin, loginController);
router.post("/register", validateRegister, registerController);

export default router;
