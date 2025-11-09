// backend/server.js

import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import HttpError from "./models/http-error.js"; 

// Routes
import jobRoutes from "./routes/jobRoute.js";
import userRoutes from "./routes/userRoute.js";
import proposalRoutes from "./routes/proposalRoute.js";
import profileRoute from './routes/profileRoute.js'
import invitationRoute from './routes/invitationRoute.js'
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Universal CORS setup (works with React, Vite, Postman)
app.use(
  cors({
    origin: true, // automatically reflects the request origin
    credentials: true,
  })
);

// ✅ Enable JSON parsing
app.use(express.json());

// --- API Routes ---
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/proposals", proposalRoutes);
app.use('/api/profiles', profileRoute)
app.use('/api/invitations', invitationRoute)

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ 404 handler
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  next(error);
});

// ✅ Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// ✅ MongoDB connection and server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
