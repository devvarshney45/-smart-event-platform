import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// Create Event (Organizer only)
export const createEvent = async (req, res) => {
  const { title, description, date, venue, capacity, deadline } = req.body;

  if (new Date(deadline) >= new Date(date))
    return res.status(400).json({ message: "Deadline must be before event date" });

  const event = await Event.create({
    title,
    description,
    date,
    venue,
    capacity,
    deadline,
    organizer: req.user.id
  });

  res.status(201).json(event);
};

// Get All Events
export const getEvents = async (req, res) => {
  const events = await Event.find().populate("organizer", "name email");
  res.json(events);
};

// Update Event (Only Own Event)
export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.organizer.toString() !== req.user.id)
    return res.status(403).json({ message: "Not your event" });

  Object.assign(event, req.body);
  await event.save();

  res.json(event);
};

// Delete Event
export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.organizer.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  await event.deleteOne();
  res.json({ message: "Event deleted" });
};