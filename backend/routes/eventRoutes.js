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

/* GET EVENTS */
router.get("/", protect, getEvents);

/* CREATE EVENT */
router.post(
  "/",
  protect,
  authorize("organizer"),
  upload.single("banner"),
  createEvent
);

/* UPDATE EVENT */
router.put(
  "/:id",
  protect,
  authorize("organizer"),
  upload.single("banner"),
  updateEvent
);

/* DELETE EVENT */
router.delete(
  "/:id",
  protect,
  authorize("organizer"),
  deleteEvent
);

/* EVENT REGISTRATIONS */
router.get(
  "/:id/registrations",
  protect,
  authorize("organizer"),
  getEventRegistrations
);

/* ORGANIZER STATS */
router.get(
  "/organizer/stats",
  protect,
  authorize("organizer"),
  getOrganizerStats
);

/* ADMIN SUSPEND */
router.put(
  "/suspend/:id",
  protect,
  authorize("admin"),
  toggleEventSuspension
);

export default router;