import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

import { generateQR } from "../utils/generateQR.js";
import { sendEmail } from "../utils/sendEmail.js";

import { v4 as uuidv4 } from "uuid";

/**
 * Participant registers for an event
 */
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check event exists
    const event = await Event.findById(eventId);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    // Check suspended
    if (event.isSuspended)
      return res.status(403).json({
        message: "This event has been suspended by admin"
      });

    // Check deadline
    if (new Date() > new Date(event.deadline))
      return res.status(400).json({
        message: "Registration deadline has passed"
      });

    // Check capacity
    const registrationCount = await Registration.countDocuments({
      event: eventId
    });

    if (registrationCount >= event.capacity)
      return res.status(400).json({
        message: "Event capacity reached"
      });

    // Generate secure unique QR identifier
    const qrIdentifier = uuidv4();

    // Create registration
    const registration = await Registration.create({
      user: userId,
      event: eventId,
      qrIdentifier
    });

    // Generate QR image (Base64)
    const qrImage = await generateQR(qrIdentifier);

    // Send confirmation email
    const user = await User.findById(userId);
    await sendEmail(
      user.email,
      "Event Registration Confirmed",
      `Hello ${user.name},\n\nYou have successfully registered for ${event.title}.\n\nEvent Date: ${event.date}\nVenue: ${event.venue}`
    );

    // Audit log
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
    // Duplicate prevention (compound index fallback)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already registered for this event"
      });
    }

    next(error);
  }
};

/**
 * Get my registrations
 */
export const myRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      user: req.user.id
    }).populate("event");

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};