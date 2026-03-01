import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import AuditLog from "../models/AuditLog.js";
import { generateCSV } from "../utils/generateCSV.js";

/**
 * Admin: View all users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: View all events
 */
export const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.json(events);
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Assign role
 */
export const assignRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["admin", "organizer", "volunteer", "participant"];

    if (!allowedRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    await AuditLog.create({
      user: req.user.id,
      action: "ASSIGN_ROLE",
      metadata: {
        targetUser: user._id,
        newRole: role
      }
    });

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Dashboard Analytics
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    const attendanceStats = await Registration.aggregate([
      {
        $group: {
          _id: "$event",
          totalRegistrations: { $sum: 1 },
          attendedCount: {
            $sum: { $cond: ["$attended", 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventDetails"
        }
      },
      { $unwind: "$eventDetails" },
      {
        $project: {
          eventTitle: "$eventDetails.title",
          totalRegistrations: 1,
          attendedCount: 1,
          attendancePercentage: {
            $cond: [
              { $eq: ["$totalRegistrations", 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      "$attendedCount",
                      "$totalRegistrations"
                    ]
                  },
                  100
                ]
              }
            ]
          }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      attendanceStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Organizer: Export participants CSV
 */
export const exportParticipants = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId
    }).populate("user", "name email attended");

    const data = registrations.map(r => ({
      name: r.user.name,
      email: r.user.email,
      attended: r.attended
    }));

    const csv = generateCSV(data);

    res.header("Content-Type", "text/csv");
    res.attachment("participants.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * Public Certificate Verification Portal
 */
export const verifyCertificate = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      certificateId: req.params.certId
    }).populate("user event");

    if (!registration)
      return res.status(404).json({
        message: "Invalid certificate ID"
      });

    res.json({
      participant: registration.user.name,
      event: registration.event.title,
      date: registration.event.date
    });
  } catch (error) {
    next(error);
  }
};