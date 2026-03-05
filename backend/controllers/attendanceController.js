import Registration from "../models/Registration.js";
import { v4 as uuidv4 } from "uuid";

export const markAttendance = async (req, res, next) => {

  try {

    const { qrIdentifier } = req.body;

    /* ================= VALIDATION ================= */

    if (!qrIdentifier) {
      return res.status(400).json({
        success: false,
        message: "QR identifier missing"
      });
    }

    const cleanQR = qrIdentifier.trim();

    /* ================= FIND REGISTRATION ================= */

    const reg = await Registration.findOne({
      qrIdentifier: cleanQR
    })
    .populate("user", "name email")
    .populate("event", "title date");

    if (!reg) {

      return res.status(404).json({
        success: false,
        message: "Invalid QR Code"
      });

    }

    /* ================= ALREADY MARKED ================= */

    if (reg.attended) {

      return res.status(200).json({

        success: true,
        message: "Attendance already marked",
        alreadyMarked: true,
        certificateReady: true,

        participant: {
          id: reg.user._id,
          name: reg.user.name,
          email: reg.user.email
        },

        event: {
          id: reg.event._id,
          title: reg.event.title
        },

        attendanceTime: reg.updatedAt,
        certificateId: reg.certificateId

      });

    }

    /* ================= MARK ATTENDANCE ================= */

    reg.attended = true;

    if (!reg.certificateId) {
      reg.certificateId = uuidv4();
    }

    reg.certificateGenerated = true;

    await reg.save();

    /* ================= RESPONSE ================= */

    return res.status(200).json({

      success: true,

      message: "Attendance marked successfully",

      alreadyMarked: false,

      certificateReady: true,

      participant: {
        id: reg.user._id,
        name: reg.user.name,
        email: reg.user.email
      },

      event: {
        id: reg.event._id,
        title: reg.event.title
      },

      attendanceTime: reg.updatedAt,

      certificateId: reg.certificateId

    });

  } catch (error) {

    console.error("Attendance error:", error);

    return res.status(500).json({
      success: false,
      message: "Attendance processing failed"
    });

  }

};