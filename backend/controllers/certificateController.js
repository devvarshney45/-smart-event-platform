import PDFDocument from "pdfkit";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

export const downloadCertificate = async (req, res) => {
  try {
    const { eventId } = req.params;

    const reg = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (!reg) {
      return res.status(404).json({ message: "Not registered" });
    }

    if (!reg.attended) {
      return res.status(400).json({ message: "Not attended yet" });
    }

    // ✅ Ensure certificate ID exists
    if (!reg.certificateId) {
      reg.certificateId = uuidv4();
      reg.certificateGenerated = true;
      await reg.save();
    }

    const event = await Event.findById(eventId);
    const user = await User.findById(req.user.id);

    // ✅ Create PDF in memory
    const doc = new PDFDocument({ size: "A4" });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${reg.certificateId}.pdf`
    );

    // Pipe PDF directly to response
    doc.pipe(res);

    // ===== Certificate Design =====
    doc.moveDown(4);
    doc.fontSize(26).text("Certificate of Participation", {
      align: "center",
    });

    doc.moveDown(2);
    doc.fontSize(20).text(user.name, {
      align: "center",
    });

    doc.moveDown(1);
    doc.fontSize(16).text(
      `has successfully attended "${event.title}"`,
      { align: "center" }
    );

    doc.moveDown(2);
    doc.fontSize(12).text(
      `Certificate ID: ${reg.certificateId}`,
      { align: "center" }
    );

    doc.end();

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Certificate generation failed",
    });
  }
};
