import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { generateQR } from "../utils/generateQR.js";
import { sendEmail, registrationTemplate } from "../utils/sendEmail.js";
import { v4 as uuidv4 } from "uuid";

/**
 * ================= REGISTER FOR EVENT =================
 */
export const registerForEvent = async (req, res, next) => {
  try {

    const { eventId } = req.params;
    const userId = req.user.id;

    /* validate event id */

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({
        message: "Event not found"
      });

    /* suspended event */

    if (event.isSuspended)
      return res.status(403).json({
        message: "This event has been suspended by admin"
      });

    /* deadline validation */

    if (new Date() > new Date(event.deadline))
      return res.status(400).json({
        message: "Registration deadline has passed"
      });

    /* event finished */

    if (new Date() > new Date(event.date))
      return res.status(400).json({
        message: "Event already completed"
      });

    /* duplicate registration */

    const existingRegistration = await Registration.findOne({
      user: new mongoose.Types.ObjectId(userId),
      event: new mongoose.Types.ObjectId(eventId)
    });

    if (existingRegistration) {
      return res.status(200).json({
        message: "Already registered",
        registration: existingRegistration
      });
    }

    /* capacity validation */

    const registrationCount = await Registration.countDocuments({
      event: eventId
    });

    if (registrationCount >= event.capacity)
      return res.status(400).json({
        message: "Event capacity reached"
      });

    /* generate unique QR */

    const qrIdentifier = uuidv4();

    const registration = await Registration.create({
      user: userId,
      event: eventId,
      qrIdentifier,
      attended: false,
      certificateGenerated: false
    });

    /* respond immediately */

    res.status(201).json({
      message: "Registration successful",
      registration
    });

    /* background tasks */

    try {

      const user = await User.findById(userId).lean();

      if (user?.email) {

        await sendEmail(
          user.email,
          "Event Registration Confirmed",
          `Hello ${user.name}, you registered for ${event.title}`,
          registrationTemplate(user.name, event)
        );

      }

      await AuditLog.create({
        user: userId,
        action: "REGISTER_EVENT",
        metadata: {
          eventId: event._id,
          eventTitle: event.title
        }
      });

    } catch (bgError) {
      console.log("Background task error:", bgError);
    }

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

    const registrations = await Registration.find({
      user: req.user.id
    })
      .populate("event")
      .lean();

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