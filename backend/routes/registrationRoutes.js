import express from "express";
import {
  registerForEvent,
  myRegistrations
} from "../controllers/registrationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:eventId", protect, authorize("participant"), registerForEvent);
router.get("/my", protect, authorize("participant"), myRegistrations);

export default router;