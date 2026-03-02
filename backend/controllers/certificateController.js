import fs from "fs";
import path from "path";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { generateCertificate } from "../utils/generateCertificate.js";

export const downloadCertificate = async (req, res) => {
  try {
    const { eventId } = req.params;

    const reg = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (!reg)
      return res.status(404).json({ message: "Not registered" });

    if (!reg.attended)
      return res.status(400).json({ message: "Not attended" });

    const event = await Event.findById(eventId);
    const user = await User.findById(req.user.id);

    // ✅ Ensure certificate ID exists
    if (!reg.certificateId) {
      reg.certificateId = uuidv4();
      reg.certificateGenerated = true;
      await reg.save();
    }

    const certificatesDir = path.join(process.cwd(), "certificates");

    // ✅ Ensure folder exists (IMPORTANT for Render)
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir);
    }

    const filePath = path.join(
      certificatesDir,
      `${reg.certificateId}.pdf`
    );

    // ✅ If file doesn't exist, generate it
    if (!fs.existsSync(filePath)) {
      await generateCertificate(user, event, reg.certificateId);
    }

    return res.download(filePath);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Certificate generation failed"
    });
  }
};