import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { generateCertificate } from "../utils/generateCertificate.js";
import { sendEmail } from "../utils/sendEmail.js";

export const downloadCertificate = async (req, res) => {

  try {

    const { eventId } = req.params;

    const reg = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (!reg) {
      return res.status(404).json({
        message: "Not registered"
      });
    }

    if (!reg.attended) {
      return res.status(400).json({
        message: "Not attended yet"
      });
    }

    const event = await Event.findById(eventId);
    const user = await User.findById(req.user.id);

    /* Generate certificate ID */

    if (!reg.certificateId) {

      reg.certificateId = uuidv4();
      reg.certificateGenerated = true;

      await reg.save();

    }

    /* Generate PDF buffer */

    const pdfBuffer = await generateCertificate(
      user,
      event,
      reg.certificateId
    );

    /* Send email in background */

    try {

      if (user?.email) {

        const frontendURL =
          process.env.FRONTEND_URL ||
          "http://localhost:5173";

        const verifyLink =
          `${frontendURL}/verify/${reg.certificateId}`;

        await sendEmail(

          user.email,

          "Your Event Certificate",

`Hello ${user.name},

Your certificate for "${event.title}" is ready.

Certificate ID: ${reg.certificateId}

Verify Certificate:
${verifyLink}

Thank you.`

        );

      }

    } catch (emailError) {

      console.log("Email failed:", emailError);

    }

    /* Download certificate */

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${user.name}-${event.title}-certificate.pdf`
    );

    res.send(pdfBuffer);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Certificate generation failed"
    });

  }

};