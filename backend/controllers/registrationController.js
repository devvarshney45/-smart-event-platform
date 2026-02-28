import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

// Register for Event
export const registerForEvent = async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (new Date() > event.deadline)
    return res.status(400).json({ message: "Registration closed" });

  const count = await Registration.countDocuments({ event: eventId });
  if (count >= event.capacity)
    return res.status(400).json({ message: "Event full" });

  try {
    const qrIdentifier = uuidv4();

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
      qrIdentifier
    });

    const qrImage = await QRCode.toDataURL(qrIdentifier);

    res.status(201).json({ registration, qrImage });
  } catch {
    res.status(400).json({ message: "Already registered" });
  }
};

// My Registrations
export const myRegistrations = async (req, res) => {
  const regs = await Registration.find({ user: req.user.id }).populate("event");
  res.json(regs);
};