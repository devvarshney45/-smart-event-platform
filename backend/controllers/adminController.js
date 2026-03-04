import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import AuditLog from "../models/AuditLog.js";
import { generateCSV } from "../utils/generateCSV.js";

/* ================= ADMIN USERS ================= */
export const getAllUsers = async (req, res, next) => {
  try {

    const users = await User
      .find()
      .select("-password")
      .lean();

    res.json(users);

  } catch (error) {
    next(error);
  }
};


/* ================= ADMIN EVENTS ================= */
export const getAllEvents = async (req, res, next) => {
  try {

    const events = await Event
      .find()
      .populate("organizer", "name email")
      .lean();

    res.json(events);

  } catch (error) {
    next(error);
  }
};


/* ================= ASSIGN ROLE ================= */
export const assignRole = async (req, res, next) => {
  try {

    const { role } = req.body;

    const allowedRoles = [
      "admin",
      "organizer",
      "volunteer",
      "participant"
    ];

    if (!allowedRoles.includes(role))
      return res.status(400).json({
        message: "Invalid role"
      });

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "User not found"
      });

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

    res.json({
      message: "Role updated successfully"
    });

  } catch (error) {
    next(error);
  }
};


/* ================= ADMIN DASHBOARD STATS ================= */
export const getAdminStats = async (req, res, next) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    /* event wise attendance */

    const attendanceStats = await Event.aggregate([

      {
        $lookup: {
          from: "registrations",
          localField: "_id",
          foreignField: "event",
          as: "registrations"
        }
      },

      {
        $project: {
          eventTitle: "$title",

          totalRegistrations: {
            $size: "$registrations"
          },

          attendedCount: {
            $size: {
              $filter: {
                input: "$registrations",
                as: "r",
                cond: { $eq: ["$$r.attended", true] }
              }
            }
          }
        }
      },

      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              { $eq: ["$totalRegistrations", 0] },
              0,
              {
                $round: [
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
                  },
                  2
                ]
              }
            ]
          }
        }
      },

      { $sort: { totalRegistrations: -1 } }

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


/* ================= CSV EXPORT ================= */
export const exportParticipants = async (req, res, next) => {
  try {

    const registrations = await Registration
      .find({
        event: req.params.eventId
      })
      .populate("user", "name email")
      .lean();

    const data = registrations.map((r) => ({
      Name: r.user?.name,
      Email: r.user?.email,
      Attended: r.attended ? "Yes" : "No"
    }));

    const csv = generateCSV(data);

    res.header("Content-Type", "text/csv");
    res.attachment("participants.csv");
    res.send(csv);

  } catch (error) {
    next(error);
  }
};


/* ================= CERTIFICATE VERIFICATION ================= */
export const verifyCertificate = async (req, res, next) => {
  try {

    const registration = await Registration
      .findOne({
        certificateId: req.params.certId
      })
      .populate("user event")
      .lean();

    if (!registration)
      return res.status(404).json({
        message: "Invalid certificate ID"
      });

    res.json({
      participant: registration.user.name,
      event: registration.event.title,
      date: new Date(registration.event.date).toDateString()
    });

  } catch (error) {
    next(error);
  }
};