import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { generateCertificate } from "../utils/generateCertificate.js";
import { sendEmail } from "../utils/sendEmail.js";

export const downloadCertificate = async (req, res) => {
  try {

    const { eventId } = req.params;

    /* ================= REGISTRATION CHECK ================= */

    const reg = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (!reg) {
      return res.status(404).json({
        message: "You are not registered for this event"
      });
    }

    if (!reg.attended) {
      return res.status(400).json({
        message: "Certificate available only after attendance"
      });
    }

    /* ================= FETCH EVENT + USER ================= */

    const [event, user] = await Promise.all([
      Event.findById(eventId),
      User.findById(req.user.id)
    ]);

    if (!event || !user) {
      return res.status(404).json({
        message: "Event or user not found"
      });
    }

    /* ================= GENERATE CERTIFICATE ID ================= */

    if (!reg.certificateId) {

      reg.certificateId = uuidv4();
      reg.certificateGenerated = true;

      await reg.save();

    }

    /* ================= GENERATE PDF ================= */

    const pdfBuffer = await generateCertificate(
      user,
      event,
      reg.certificateId
    );

    /* ================= SEND EMAIL (NON BLOCKING) ================= */

    if (user?.email) {

      const frontendURL =
        process.env.FRONTEND_URL ||
        "http://localhost:5173";

      const verifyLink =
        `${frontendURL}/verify/${reg.certificateId}`;

      sendEmail(
        user.email,
        "Your Event Certificate",
`Hello ${user.name},

Your certificate for "${event.title}" is ready.

Certificate ID: ${reg.certificateId}

Verify Certificate:
${verifyLink}

Thank you for attending the event.`
      ).catch(err => {
        console.log("Email failed:", err.message);
      });

    }

    /* ================= DOWNLOAD RESPONSE ================= */

    const safeEventTitle = event.title
      .replace(/[^a-zA-Z0-9]/g, "_");

    const safeUserName = user.name
      .replace(/[^a-zA-Z0-9]/g, "_");

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${safeUserName}-${safeEventTitle}-certificate.pdf`
    );

    return res.send(pdfBuffer);

  } catch (error) {

    console.error("Certificate error:", error);

    return res.status(500).json({
      message: "Certificate generation failed"
    });

  }
};