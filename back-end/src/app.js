import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./api/auth/auth.routes.js";

dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(helmet());

// Enable CORS for specified client URL
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic route to check API status
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// this creates a root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Grabeat API",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);

// 404 handler - MUST be LAST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

export default app;
