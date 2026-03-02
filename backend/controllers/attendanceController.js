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

    const reg = await Registration.findOne({
      qrIdentifier
    });

    if (!reg) {
      return res.status(404).json({
        message: "Invalid QR"
      });
    }

    if (reg.attended) {
      return res.status(400).json({
        message: "Attendance already marked"
      });
    }

    // ✅ Mark attended
    reg.attended = true;

    // ✅ Generate certificate ID immediately
    reg.certificateGenerated = true;
    reg.certificateId = uuidv4();

    await reg.save();

    return res.status(200).json({
      message: "Attendance marked successfully",
      certificateReady: true
    });

  } catch (error) {
    next(error);
  }
};