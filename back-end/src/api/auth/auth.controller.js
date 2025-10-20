import { registerUser, loginUser } from "./auth.service.js";
import jwt from "jsonwebtoken";

// Register Controller
const registerController = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, confirmPassword } = req.body;
    // Service layer handles business logic
    const user = await registerUser(fullName, email, password, phoneNumber, confirmPassword);
    // Controller creates session (JWT token)
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // For mobile: Also return token in response
    res.status(201).json({
      message: "User registered successfully",
      user,
      token, // Mobile app can store this in SecureStore
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    // Service returns user data
    const user = await loginUser(req.body);
    // Controller creates JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Return user + token
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export { registerController, loginController };
