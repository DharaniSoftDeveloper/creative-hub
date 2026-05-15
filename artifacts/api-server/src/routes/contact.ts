import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

router.post("/contact", async (req, res) => {
  const {
    name,
    email,
    phone,
    orgName,
    projectTitle,
    projectType,
    howItWorks,
    features,
    additionalNotes,
  } = req.body as Record<string, string>;

  if (!name || !email || !projectTitle || !howItWorks) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const gmailUser = process.env["GMAIL_USER"];
  const gmailPass = process.env["GMAIL_APP_PASSWORD"];

  if (!gmailUser || !gmailPass) {
    req.log.error("Email credentials not configured");
    res.status(500).json({ error: "Email service not configured" });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0a1e; color: #e2e8f0; padding: 32px; border-radius: 16px; border: 1px solid #3b1fa8;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #a855f7; font-size: 28px; margin: 0;">Creative Hub</h1>
        <p style="color: #94a3b8; margin: 8px 0 0;">New Project Request Received</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Name</span>
            <p style="margin: 4px 0 0; font-size: 16px; font-weight: bold;">${name}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Email</span>
            <p style="margin: 4px 0 0; font-size: 16px;"><a href="mailto:${email}" style="color: #a855f7;">${email}</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Phone</span>
            <p style="margin: 4px 0 0; font-size: 16px;">${phone || "Not provided"}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Organization</span>
            <p style="margin: 4px 0 0; font-size: 16px;">${orgName || "Not provided"}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Project Title</span>
            <p style="margin: 4px 0 0; font-size: 18px; font-weight: bold; color: #a855f7;">${projectTitle}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Project Type</span>
            <p style="margin: 4px 0 0; font-size: 16px;">${projectType || "Not specified"}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">How the Project Works</span>
            <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${howItWorks}</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #1e1040;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Required Features</span>
            <p style="margin: 8px 0 0; font-size: 15px;">${features || "None specified"}</p>
          </td>
        </tr>
        ${additionalNotes ? `
        <tr>
          <td style="padding: 16px 0;">
            <span style="color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Additional Notes</span>
            <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${additionalNotes}</p>
          </td>
        </tr>` : ""}
      </table>

      <div style="margin-top: 32px; text-align: center; color: #64748b; font-size: 13px;">
        <p>This request was submitted via the Creative Hub website</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Creative Hub Website" <${gmailUser}>`,
      to: "creativehub2k@gmail.com",
      subject: `New Project Request: ${projectTitle}`,
      html,
      replyTo: email,
    });

    req.log.info({ name, projectTitle }, "Contact email sent");
    res.json({ success: true, message: "Your request has been sent successfully!" });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send email. Please try again." });
  }
});

export default router;
