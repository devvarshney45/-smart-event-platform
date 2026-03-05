import Registration from "../models/Registration.js";
import { v4 as uuidv4 } from "uuid";

/* =====================================================
   MARK ATTENDANCE
===================================================== */

export const markAttendance = async (req, res) => {

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

    const reg = await Registration
      .findOne({ qrIdentifier: cleanQR })
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

/* =====================================================
   GET MARKED ATTENDANCE LIST
   (For volunteer dashboard / scan page)
===================================================== */

export const getMarkedAttendance = async (req, res) => {

  try {

    const registrations = await Registration
      .find({ attended: true })
      .populate("user", "name email")
      .populate("event", "title")
      .sort({ updatedAt: -1 });

    const formatted = registrations.map((r) => ({

      name: r.user?.name || "Unknown",

      email: r.user?.email || "",

      event: r.event?.title || "",

      time: r.updatedAt

    }));

    return res.status(200).json(formatted);

  } catch (error) {

    console.error("Fetch attendance error:", error);

    return res.status(500).json({
      message: "Failed to fetch attendance"
    });

  }

};