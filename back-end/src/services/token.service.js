import redis from "../config/redis.js";
import jwt from "jsonwebtoken";

/**
 * Token Service - Manages active tokens using Redis whitelist
 * Only tokens stored in Redis are considered valid
 */

// Store token in Redis whitelist
const storeToken = async (userId, token) => {
  try {
    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    const expiresAt = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    const ttl = expiresAt - now; // Time to live in seconds

    if (ttl <= 0) {
      throw new Error("Token has already expired");
    }

    // Store token with user metadata
    const tokenKey = `token:${token}`;
    const tokenData = JSON.stringify({
      userId,
      email: decoded.email,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp,
    });

    // Set token in Redis with automatic expiration
    await redis.setex(tokenKey, ttl, tokenData);

    // Also maintain a set of all tokens for this user (for logout all devices)
    const userTokensKey = `user:${userId}:tokens`;
    await redis.sadd(userTokensKey, token);
    await redis.expire(userTokensKey, ttl);

    return { success: true, expiresIn: ttl };
  } catch (error) {
    console.error("Error storing token:", error);
    throw error;
  }
};

// Check if token exists in whitelist (is valid)
const isTokenValid = async (token) => {
  try {
    const tokenKey = `token:${token}`;
    const exists = await redis.exists(tokenKey);
    return exists === 1; // Returns true if token exists in Redis
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};

// Get token data from Redis
const getTokenData = async (token) => {
  try {
    const tokenKey = `token:${token}`;
    const data = await redis.get(tokenKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting token data:", error);
    return null;
  }
};

// Invalidate single token (logout from current device)
const invalidateToken = async (token) => {
  try {
    // Get token data to find userId
    const tokenData = await getTokenData(token);
    if (tokenData) {
      // Remove from user's token set
      const userTokensKey = `user:${tokenData.userId}:tokens`;
      await redis.srem(userTokensKey, token);
    }
    // Remove token from whitelist
    const tokenKey = `token:${token}`;
    const deleted = await redis.del(tokenKey);

    return { success: deleted > 0, message: "Token invalidated successfully" };
  } catch (error) {
    console.error("Error invalidating token:", error);
    throw error;
  }
};

// Invalidate all tokens for a user (logout from all devices)
const invalidateAllUserTokens = async (userId) => {
  try {
    const userTokensKey = `user:${userId}:tokens`;
    // Get all tokens for this user
    const tokens = await redis.smembers(userTokensKey);

    if (tokens.length === 0) {
      return { success: true, count: 0, message: "No active tokens found" };
    }

    // Delete all tokens
    const pipeline = redis.pipeline();
    tokens.forEach((token) => {
      pipeline.del(`token:${token}`);
    });
    pipeline.del(userTokensKey); // Delete the set itself

    await pipeline.exec();

    return {
      success: true,
      count: tokens.length,
      message: `${tokens.length} token(s) invalidated`,
    };
  } catch (error) {
    console.error("Error invalidating all user tokens:", error);
    throw error;
  }
};

// Get all active tokens for a user (for admin/user dashboard)
const getUserActiveTokens = async (userId) => {
  try {
    const userTokensKey = `user:${userId}:tokens`;
    const tokens = await redis.smembers(userTokensKey);

    // Get detailed info for each token
    const tokenDetails = await Promise.all(
      tokens.map(async (token) => {
        const data = await getTokenData(token);
        const ttl = await redis.ttl(`token:${token}`);
        return {
          token: token.substring(0, 20) + "...", // Truncate for security
          issuedAt: data?.issuedAt ? new Date(data.issuedAt * 1000) : null,
          expiresAt: data?.expiresAt ? new Date(data.expiresAt * 1000) : null,
          ttl: ttl > 0 ? ttl : 0,
        };
      })
    );

    return { count: tokens.length, tokens: tokenDetails };
  } catch (error) {
    console.error("Error getting user active tokens:", error);
    throw error;
  }
};

// Refresh token - invalidate old and create new
const refreshToken = async (oldToken, newToken, userId) => {
  try {
    // Invalidate old token
    await invalidateToken(oldToken);

    // Store new token
    await storeToken(userId, newToken);

    return { success: true, message: "Token refreshed successfully" };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export {
  storeToken,
  isTokenValid,
  getTokenData,
  invalidateToken,
  invalidateAllUserTokens,
  getUserActiveTokens,
  refreshToken,
};
