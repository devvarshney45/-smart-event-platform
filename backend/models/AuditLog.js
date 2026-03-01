import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    metadata: Object
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditSchema);