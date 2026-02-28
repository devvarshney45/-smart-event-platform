import Registration from "../models/Registration.js";

export const markAttendance = async (req, res) => {
  const { qrIdentifier } = req.body;

  const reg = await Registration.findOne({ qrIdentifier });

  if (!reg) return res.status(404).json({ message: "Invalid QR" });
  if (reg.attended)
    return res.status(400).json({ message: "Already marked" });

  reg.attended = true;
  await reg.save();

  res.json({ message: "Attendance marked" });
};