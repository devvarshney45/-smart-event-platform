import express from "express";

import {
  markAttendance,
  getMarkedAttendance
} from "../controllers/attendanceController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= MARK ATTENDANCE ================= */

router.post(
  "/",
  protect,
  authorize("volunteer"),
  markAttendance
);

/* ================= GET MARKED ATTENDANCE LIST ================= */

router.get(
  "/list",
  protect,
  authorize("volunteer"),
  getMarkedAttendance
);

export default router;