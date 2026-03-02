import Registration from "../models/Registration.js";

export const markAttendance = async (req, res, next) => {
  try {
    const { qrIdentifier } = req.body;

    if (!qrIdentifier) {
      return res.status(400).json({
        message: "QR identifier missing"
      });
    }

    let extractedId;

    // 🔥 Handle both JSON QR and plain UUID QR
    try {
      const parsed = JSON.parse(qrIdentifier);

      // If QR contains: {"id":"uuid"}
      if (parsed && parsed.id) {
        extractedId = parsed.id;
      } else {
        extractedId = qrIdentifier;
      }

    } catch {
      // If not JSON, assume plain UUID
      extractedId = qrIdentifier;
    }

    const reg = await Registration.findOne({
      qrIdentifier: extractedId
    });

    if (!reg) {
      return res.status(404).json({
        message: "Invalid QR"
      });
    }

    if (reg.attended) {
      return res.status(400).json({
        message: "Already marked"
      });
    }

    reg.attended = true;
    await reg.save();

    return res.status(200).json({
      message: "Attendance marked successfully"
    });

  } catch (error) {
    next(error);
  }
};