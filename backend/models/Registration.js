import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    attended: { type: Boolean, default: false },
    certificateGenerated: { type: Boolean, default: false },
    qrIdentifier: { type: String, unique: true },
    certificateId: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);