import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= EMAIL TEMPLATE ================= */

const registrationTemplate = (userName, event) => {

  return `
  <div style="font-family: Arial, sans-serif; background:#f3f4f6; padding:30px">

    <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px">

      <h2 style="color:#4f46e5">Event Registration Confirmed 🎉</h2>

      <p>Hello <b>${userName}</b>,</p>

      <p>You have successfully registered for the event:</p>

      <h3 style="color:#111827">${event.title}</h3>

      <p>
      📅 <b>Date:</b> ${new Date(event.date).toDateString()} <br/>
      📍 <b>Venue:</b> ${event.venue}
      </p>

      <p>
      Please bring your <b>QR code</b> on the event day for attendance.
      </p>

      <hr style="margin:20px 0"/>

      <p style="font-size:12px;color:#6b7280">
      Event Management Platform
      </p>

    </div>

  </div>
  `;

};

/* ================= SEND EMAIL ================= */

export const sendEmail = async (
  to,
  subject,
  text,
  html
) => {

  try {

    const mailOptions = {
      from: `"Event Platform" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

  } catch (error) {

    console.error("Email failed:", error);

  }

};

export { registrationTemplate };