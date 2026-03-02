import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

import { generateQR } from "../utils/generateQR.js";
import { sendEmail } from "../utils/sendEmail.js";

import { v4 as uuidv4 } from "uuid";

/**
 * ================= REGISTER FOR EVENT =================
 */
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.isSuspended)
      return res.status(403).json({
        message: "This event has been suspended by admin"
      });

    if (new Date() > new Date(event.deadline))
      return res.status(400).json({
        message: "Registration deadline has passed"
      });

    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You have already registered for this event"
      });
    }

    const registrationCount = await Registration.countDocuments({
      event: eventId
    });

    if (registrationCount >= event.capacity)
      return res.status(400).json({
        message: "Event capacity reached"
      });

    const qrIdentifier = uuidv4();

    const registration = await Registration.create({
      user: userId,
      event: eventId,
      qrIdentifier
    });

    const qrImage = await generateQR(qrIdentifier);

    const user = await User.findById(userId);

    await sendEmail(
      user.email,
      "Event Registration Confirmed",
      `Hello ${user.name},

You have successfully registered for ${event.title}.

Event Date: ${event.date}
Venue: ${event.venue}

Please bring your QR code on event day.`
    );

    await AuditLog.create({
      user: userId,
      action: "REGISTER_EVENT",
      metadata: {
        eventId: event._id,
        eventTitle: event.title
      }
    });

    res.status(201).json({
      message: "Registration successful",
      registration,
      qrImage
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * ================= GET MY REGISTRATIONS =================
 */
export const myRegistrations = async (req, res, next) => {
  try {
    // ✅ Use lean() for fresh plain objects
    const registrations = await Registration.find({
      user: req.user.id
    })
      .populate("event")
      .lean();

    // ✅ Attach QR image safely
    const registrationsWithQR = await Promise.all(
      registrations.map(async (reg) => {
        const qrImage = await generateQR(reg.qrIdentifier);

        return {
          ...reg,
          qrImage
        };
      })
    );

    res.json(registrationsWithQR);

  } catch (error) {
    console.error(error);
    next(error);
  }
};