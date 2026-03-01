import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  getOrganizerStats,
  toggleEventSuspension
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getEvents);

router.post(
  "/",
  protect,
  authorize("organizer"),
  upload.single("banner"),
  createEvent
);

router.put(
  "/:id",
  protect,
  authorize("organizer"),
  upload.single("banner"),
  updateEvent
);

router.delete("/:id", protect, authorize("organizer"), deleteEvent);

router.get(
  "/:id/registrations",
  protect,
  authorize("organizer"),
  getEventRegistrations
);

router.get(
  "/organizer/stats",
  protect,
  authorize("organizer"),
  getOrganizerStats
);

router.put(
  "/suspend/:id",
  protect,
  authorize("admin"),
  toggleEventSuspension
);

export default router;