import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import AuditLog from "../models/AuditLog.js";

/**
 * ================= CREATE EVENT =================
 */
export const createEvent = async (req, res, next) => {
  try {

    const {
      title,
      description,
      date,
      venue,
      capacity,
      deadline
    } = req.body;

    if (new Date(deadline) >= new Date(date)) {
      return res.status(400).json({
        message: "Registration deadline must be before event date"
      });
    }

    if (capacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be greater than 0"
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      capacity,
      deadline,
      organizer: req.user.id,
      banner: req.file ? req.file.path : null
    });

    await AuditLog.create({
      user: req.user.id,
      action: "CREATE_EVENT",
      metadata: { eventId: event._id }
    });

    res.status(201).json(event);

  } catch (error) {
    next(error);
  }
};


/**
 * ================= GET EVENTS =================
 */
export const getEvents = async (req, res, next) => {
  try {

    const query = {};

    if (req.query.mine === "true") {
      query.organizer = req.user.id;
    }

    const events = await Event
      .find(query)
      .populate("organizer", "name email")
      .lean();

    const eventIds = events.map(e => e._id);

    const stats = await Registration.aggregate([
      { $match: { event: { $in: eventIds } } },
      {
        $group: {
          _id: "$event",
          totalRegistrations: { $sum: 1 },
          attendedCount: {
            $sum: { $cond: ["$attended", 1, 0] }
          }
        }
      }
    ]);

    const statsMap = {};

    stats.forEach(s => {

      const percentage =
        s.totalRegistrations === 0
          ? 0
          : Math.round(
              (s.attendedCount /
                s.totalRegistrations) * 100
            );

      statsMap[s._id] = {
        totalRegistrations: s.totalRegistrations,
        attendedCount: s.attendedCount,
        attendancePercentage: percentage
      };

    });

    const finalEvents = events.map(event => ({
      ...event,
      totalRegistrations:
        statsMap[event._id]?.totalRegistrations || 0,
      attendedCount:
        statsMap[event._id]?.attendedCount || 0,
      attendancePercentage:
        statsMap[event._id]?.attendancePercentage || 0
    }));

    res.json(finalEvents);

  } catch (error) {
    next(error);
  }
};


/**
 * ================= UPDATE EVENT =================
 */
export const updateEvent = async (req, res, next) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({
        message: "Event not found"
      });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({
        message: "Not authorized"
      });

    const {
      title,
      description,
      date,
      venue,
      capacity,
      deadline
    } = req.body;

    if (deadline && date && new Date(deadline) >= new Date(date)) {
      return res.status(400).json({
        message: "Registration deadline must be before event date"
      });
    }

    if (capacity && capacity <= 0) {
      return res.status(400).json({
        message: "Capacity must be greater than 0"
      });
    }

    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.venue = venue ?? event.venue;
    event.capacity = capacity ?? event.capacity;
    event.deadline = deadline ?? event.deadline;

    if (req.file) {
      event.banner = req.file.path;
    }

    await event.save();

    await AuditLog.create({
      user: req.user.id,
      action: "UPDATE_EVENT",
      metadata: { eventId: event._id }
    });

    res.json(event);

  } catch (error) {
    next(error);
  }
};


/**
 * ================= DELETE EVENT =================
 */
export const deleteEvent = async (req, res, next) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({
        message: "Event not found"
      });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({
        message: "Not authorized"
      });

    await Registration.deleteMany({
      event: event._id
    });

    await event.deleteOne();

    await AuditLog.create({
      user: req.user.id,
      action: "DELETE_EVENT",
      metadata: { eventId: req.params.id }
    });

    res.json({
      message: "Event deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


/**
 * ================= EVENT REGISTRATIONS =================
 */
export const getEventRegistrations = async (req, res, next) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({
        message: "Event not found"
      });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({
        message: "Not authorized"
      });

    const registrations = await Registration
      .find({ event: req.params.id })
      .populate("user", "name email")
      .lean();

    res.json(registrations);

  } catch (error) {
    next(error);
  }
};


/**
 * ================= ORGANIZER STATS =================
 */
export const getOrganizerStats = async (req, res, next) => {
  try {

    const events = await Event.find({
      organizer: req.user.id
    });

    const eventIds = events.map(e => e._id);

    const stats = await Registration.aggregate([
      { $match: { event: { $in: eventIds } } },
      {
        $group: {
          _id: "$event",
          totalRegistrations: { $sum: 1 },
          attendedCount: {
            $sum: { $cond: ["$attended", 1, 0] }
          }
        }
      }
    ]);

    res.json(stats);

  } catch (error) {
    next(error);
  }
};


/**
 * ================= ADMIN SUSPEND EVENT =================
 */
export const toggleEventSuspension = async (req, res, next) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({
        message: "Event not found"
      });

    event.isSuspended = !event.isSuspended;

    await event.save();

    await AuditLog.create({
      user: req.user.id,
      action: "TOGGLE_EVENT_SUSPENSION",
      metadata: { eventId: event._id }
    });

    res.json({
      message: `Event ${
        event.isSuspended
          ? "suspended"
          : "activated"
      }`
    });

  } catch (error) {
    next(error);
  }
};