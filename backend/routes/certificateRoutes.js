import express from "express";
import { downloadCertificate } from "../controllers/certificateController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/:eventId", protect, authorize("participant"), downloadCertificate);

export default router;