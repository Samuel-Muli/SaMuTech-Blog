// Sends a best-effort notification email when someone subscribes.
// Fully optional: if SMTP_USER / SMTP_PASS aren't set in the environment,
// this silently does nothing. It never throws — a failed notification
// should never break the actual subscribe request.
//
// To activate, set these in your .env (or your host's environment vars):
//   SMTP_USER=your.sending.address@gmail.com
//   SMTP_PASS=your-gmail-app-password   (NOT your normal Gmail password —
//                                         generate one at myaccount.google.com/apppasswords)
//   NOTIFY_EMAIL=samumutua93@gmail.com   (defaults to this if unset)
//
// Any SMTP provider works, not just Gmail — see SMTP_HOST/SMTP_PORT below.

let transporter = null;

const isConfigured = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (!isConfigured()) return null;
  if (transporter) return transporter;

  const nodemailer = require("nodemailer");
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

const notifyNewSubscriber = async (email) => {
  if (!isConfigured()) return; // not set up — skip silently

  try {
    const to = process.env.NOTIFY_EMAIL || "samumutua93@gmail.com";
    await getTransporter().sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "New SaMuTech subscriber",
      text: `${email} just subscribed to SaMuTech.`,
    });
  } catch (error) {
    // Never let a notification failure affect the subscribe response.
    console.error("Subscriber notification email failed:", error.message);
  }
};

module.exports = { notifyNewSubscriber };
