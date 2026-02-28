import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createEventSchema } from "../validations/eventValidation.js";

const router = express.Router();

router.get("/", getEvents);

router.post(
  "/",
  protect,
  authorize("organizer"),
  validate(createEventSchema),
  createEvent
);

router.put("/:id", protect, authorize("organizer"), updateEvent);
router.delete("/:id", protect, authorize("organizer"), deleteEvent);

export default router;