// pages/api/contact.js
import nodemailer from "nodemailer";


function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name = "", email = "", subject = "", message = "" } = req.body || {};

  // Basic server-side validation
  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  
  const cleanName = escapeHtml(name);
  const cleanEmail = escapeHtml(email);
  const cleanSubject = escapeHtml(subject || "New contact message");
  const cleanMessage = escapeHtml(message).replaceAll("\n", "<br>");

  const toEmail = process.env.TO_EMAIL;
  if (!toEmail) {
    console.error("Missing TO_EMAIL env var");
    return res.status(500).json({ error: "Email destination not configured" });
  }

  // Create transporter
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } catch (e) {
    console.error("Transporter error:", e);
    return res.status(500).json({ error: "Mail transporter configuration error" });
  }

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;">
      <h2>New contact from ${cleanName}</h2>
      <p><strong>From:</strong> ${cleanName} &lt;${cleanEmail}&gt;</p>
      <p><strong>Subject:</strong> ${cleanSubject}</p>
      <hr />
      <div style="white-space:pre-wrap;">${cleanMessage}</div>
      <hr />
      <p style="font-size:12px;color:#666">This message was sent from your website contact form.</p>
    </div>
  `;

  const mailOptions = {
    from: `${cleanName} <${process.env.SMTP_USER}>`, // sender shown in inbox
    to: toEmail,
    subject: `Contact form: ${cleanSubject}`,
    text: `${cleanMessage}\n\nFrom: ${cleanName} <${cleanEmail}>`,
    html,
    replyTo: cleanEmail, // enables direct reply to the sender
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("sendMail error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
