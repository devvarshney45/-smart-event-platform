import Registration from "../models/Registration.js";
import { v4 as uuidv4 } from "uuid";

export const markAttendance = async (req, res, next) => {
  try {

    const { qrIdentifier } = req.body;

    /* ================= VALIDATION ================= */

    if (!qrIdentifier) {
      return res.status(400).json({
        message: "QR identifier missing"
      });
    }

    const cleanQR = qrIdentifier.trim();

    /* ================= FIND REGISTRATION ================= */

    const reg = await Registration.findOne({
      qrIdentifier: cleanQR
    })
    .populate("user", "name email")   // ⭐ important
    .populate("event", "title date");

    if (!reg) {
      return res.status(404).json({
        message: "Invalid QR"
      });
    }

    /* ================= ALREADY MARKED ================= */

    if (reg.attended) {

      return res.status(200).json({
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
        }

      });

    }

    /* ================= MARK ATTENDANCE ================= */

    reg.attended = true;

    /* certificate id */

    if (!reg.certificateId) {
      reg.certificateId = uuidv4();
    }

    reg.certificateGenerated = true;

    await reg.save();

    /* ================= RESPONSE ================= */

    return res.status(200).json({

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

      certificateId: reg.certificateId

    });

  } catch (error) {

    console.error("Attendance error:", error);

    next(error);

  }
};