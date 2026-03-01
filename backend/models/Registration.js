import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    attended: {
      type: Boolean,
      default: false
    },
    certificateGenerated: {
      type: Boolean,
      default: false
    },
    certificateId: String,
    qrIdentifier: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);