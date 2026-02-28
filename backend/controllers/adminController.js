import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import { generateCSV } from "../utils/generateCSV.js";

export const getAdminStats = async (req, res) => {
  const users = await User.countDocuments();
  const events = await Event.countDocuments();
  const registrations = await Registration.countDocuments();

  res.json({ users, events, registrations });
};

// CSV Export for Organizer
export const exportParticipants = async (req, res) => {
  const regs = await Registration.find({ event: req.params.eventId })
    .populate("user", "name email");

  const data = regs.map(r => ({
    name: r.user.name,
    email: r.user.email,
    attended: r.attended
  }));

  const csv = generateCSV(data);

  res.header("Content-Type", "text/csv");
  res.attachment("participants.csv");
  res.send(csv);
};