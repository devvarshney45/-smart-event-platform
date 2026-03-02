import Registration from "../models/Registration.js";
import { v4 as uuidv4 } from "uuid";

export const markAttendance = async (req, res, next) => {
  try {
    const { qrIdentifier } = req.body;

    if (!qrIdentifier) {
      return res.status(400).json({
        message: "QR identifier missing"
      });
    }

    // ✅ Trim for safety
    const cleanQR = qrIdentifier.trim();

    const reg = await Registration.findOne({
      qrIdentifier: cleanQR
    });

    if (!reg) {
      return res.status(404).json({
        message: "Invalid QR"
      });
    }

    // ✅ If already attended → return success (NO ERROR)
    if (reg.attended) {
      return res.status(200).json({
        message: "Attendance already marked",
        alreadyMarked: true,
        certificateReady: true
      });
    }

    // ✅ Mark attendance
    reg.attended = true;

    // ✅ Generate certificateId only if not exists
    if (!reg.certificateId) {
      reg.certificateId = uuidv4();
    }

    reg.certificateGenerated = true;

    await reg.save();

    return res.status(200).json({
      message: "Attendance marked successfully",
      alreadyMarked: false,
      certificateReady: true
    });

  } catch (error) {
    next(error);
  }
};