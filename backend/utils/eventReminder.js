import cron from "node-cron";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import { sendEmail } from "./sendEmail.js";

/* ================= EVENT REMINDER CRON ================= */

export const startEventReminder = () => {

cron.schedule("0 9 * * *", async () => {

  try {

    console.log("Checking upcoming events...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfDay = new Date(tomorrow.setHours(0,0,0,0));
    const endOfDay = new Date(tomorrow.setHours(23,59,59,999));

    const events = await Event.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    for (const event of events) {

      const registrations = await Registration
        .find({ event: event._id })
        .populate("user");

      for (const reg of registrations) {

        const user = reg.user;

        if (!user?.email) continue;

        await sendEmail(
          user.email,
          `Reminder: ${event.title} is tomorrow`,
          `Hello ${user.name},

Reminder that the event "${event.title}" starts tomorrow.

Event Details:
Date: ${new Date(event.date).toDateString()}
Venue: ${event.venue}

Please bring your QR code for attendance.

Thank you.`
        );

      }

    }

  } catch (error) {

    console.error("Reminder error:", error);

  }

});

};