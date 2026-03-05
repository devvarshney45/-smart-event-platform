import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";

import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

/* ⭐ EVENT REMINDER CRON */
import { startEventReminder } from "./utils/eventReminder.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);

/* ---------------- SECURITY MIDDLEWARE ---------------- */

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: false
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
  })
);

/* ---------------- CORE MIDDLEWARE ---------------- */

app.use(express.json());

/* ---------------- STATIC FILES ---------------- */

app.use("/uploads", express.static(path.join("uploads")));

/* ---------------- ROOT ROUTE ---------------- */

app.get("/", (req, res) => {
  res.send("Smart Event Platform API Running 🚀");
});

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

/* ---------------- ERROR HANDLER ---------------- */

app.use(errorHandler);

/* ---------------- START CRON JOB ---------------- */

startEventReminder();

/* ---------------- SERVER START ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});