import { registerUser, loginUser, logoutUser, logoutAllDevices } from "./auth.service.js";
import { storeToken } from "../../services/token.service.js";
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

    // Store token in Redis whitelist
    await storeToken(user.id, token);

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

    // Store token in Redis whitelist
    await storeToken(user.id, token);

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

const logoutController = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Invalidate the token (remove from Redis whitelist)
    const result = await logoutUser(token);

    res.status(200).json({
      message: "Logout successful",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout from all devices
const logoutAllController = async (req, res) => {
  try {
    // Get userId from authenticated request (set by auth middleware)
    const { userId } = req.user || req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    // Invalidate all tokens for this user
    const result = await logoutAllDevices(userId);

    res.status(200).json({
      message: "Logged out from all devices successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { registerController, loginController, logoutController, logoutAllController };
