import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import AuditLog from "../models/AuditLog.js";

/**
 * Organizer: Create Event (with banner upload optional)
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

    if (new Date(deadline) >= new Date(date))
      return res.status(400).json({
        message: "Registration deadline must be before event date"
      });

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
 * Get All Events (Public view)
 */
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.json(events);
  } catch (error) {
    next(error);
  }
};

/**
 * Organizer: Update Own Event
 */
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(event, req.body);

    if (req.file) event.banner = req.file.path;

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
 * Organizer: Delete Own Event
 */
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await event.deleteOne();

    await AuditLog.create({
      user: req.user.id,
      action: "DELETE_EVENT",
      metadata: { eventId: req.params.id }
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Organizer: View Registrations for Own Event
 */
export const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const registrations = await Registration.find({
      event: req.params.id
    }).populate("user", "name email");

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

/**
 * Organizer: Attendance Ratio Stats
 */
export const getOrganizerStats = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
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
 * Admin: Suspend / Unsuspend Event
 */
export const toggleEventSuspension = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event)
      return res.status(404).json({ message: "Event not found" });

    event.isSuspended = !event.isSuspended;
    await event.save();

    await AuditLog.create({
      user: req.user.id,
      action: "TOGGLE_EVENT_SUSPENSION",
      metadata: { eventId: event._id }
    });

    res.json({
      message: `Event ${event.isSuspended ? "suspended" : "activated"}`
    });
  } catch (error) {
    next(error);
  }
};