import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { generateCertificate } from "../utils/generateCertificate.js";

export const downloadCertificate = async (req, res) => {
  const { eventId } = req.params;

  const reg = await Registration.findOne({
    user: req.user.id,
    event: eventId
  });

  if (!reg) return res.status(404).json({ message: "Not registered" });
  if (!reg.attended)
    return res.status(400).json({ message: "Not attended" });

  const event = await Event.findById(eventId);
  const user = await User.findById(req.user.id);

  const certId = uuidv4();
  reg.certificateGenerated = true;
  reg.certificateId = certId;
  await reg.save();

  const path = generateCertificate(user, event, certId);

  res.download(path);
};