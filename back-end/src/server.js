import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || "localhost";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, HOST, () => {
      console.log("🚀 Server running on http://" + HOST + ":" + PORT);
      console.log("📊 Environment: " + process.env.NODE_ENV);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
