import express from "express";
import {
  getAllUsers,
  getAllEvents,
  assignRole,
  getAdminStats,
  exportParticipants,
  verifyCertificate
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/events", protect, authorize("admin"), getAllEvents);
router.put("/role/:id", protect, authorize("admin"), assignRole);

router.get("/stats", protect, authorize("admin"), getAdminStats);

router.get(
  "/export/:eventId",
  protect,
  authorize("organizer"),
  exportParticipants
);

router.get("/verify/:certId", verifyCertificate);

export default router;