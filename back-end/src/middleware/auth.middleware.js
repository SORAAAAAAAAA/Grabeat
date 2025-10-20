import jwt from "jsonwebtoken";
import { isTokenValid } from "../services/token.service.js";

/**
 * Auth Middleware - Validates JWT tokens and checks Redis whitelist
 * Only tokens in the Redis whitelist are considered valid
 */

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token exists in Redis whitelist (Option 2: Whitelist)
    const isValid = await isTokenValid(token);

    if (!isValid) {
      return res.status(401).json({
        error: "Token has been invalidated or session expired",
      });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ error: "Authentication failed" });
  }
};

// Optional: Middleware for refresh token validation
const authenticateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if refresh token is in whitelist
    const isValid = await isTokenValid(refreshToken);

    if (!isValid) {
      return res.status(401).json({ error: "Refresh token invalidated" });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    req.refreshToken = refreshToken;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Refresh token expired" });
    }
    return res.status(500).json({ error: "Refresh token validation failed" });
  }
};

export { authenticateToken, authenticateRefreshToken };
