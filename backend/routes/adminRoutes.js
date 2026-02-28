import express from "express";
import { getAdminStats, exportParticipants } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/export/:eventId", protect, authorize("organizer"), exportParticipants);

export default router;