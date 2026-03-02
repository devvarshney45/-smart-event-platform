import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect,authorize("volunteer"), markAttendance);

export default router;