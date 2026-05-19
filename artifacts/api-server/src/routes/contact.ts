import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e1040;">
        <span style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${label}</span>
        <p style="margin:4px 0 0;font-size:15px;color:#e2e8f0;white-space:pre-wrap;">${value}</p>
      </td>
    </tr>`;
}

function section(title: string, content: string) {
  return `
    <tr>
      <td style="padding:18px 0 6px;">
        <p style="margin:0;font-size:13px;font-weight:bold;color:#a855f7;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #3b1fa8;padding-bottom:6px;">${title}</p>
      </td>
    </tr>
    ${content}`;
}

router.post("/contact", async (req, res) => {
  const {
    name, email, phone, orgName, projectTitle, projectType,
    howItWorks, features, additionalNotes,
    contactMethod, purpose, problemSolved, targetUsers,
    hasAdminDashboard, hasFileUpload, needsCloud,
    referenceApps, loginTypes, onlineOffline, notificationTypes,
    hasLogo, launchDate, budget, specialInstructions,
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
    auth: { user: gmailUser, pass: gmailPass },
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#0f0a1e;color:#e2e8f0;padding:32px;border-radius:16px;border:1px solid #3b1fa8;">
      <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #3b1fa8;">
        <h1 style="color:#a855f7;font-size:26px;margin:0 0 4px;">Creative Hub</h1>
        <p style="color:#94a3b8;margin:0;font-size:14px;">New Project Request Received</p>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${section("Basic Information", `
          ${row("Full Name", name)}
          ${row("Business / Company", orgName)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Preferred Contact", contactMethod)}
        `)}
        ${section("Project Overview", `
          ${row("App / Project Name", projectTitle)}
          ${row("Platform(s)", projectType)}
          ${row("Main Purpose", purpose)}
          ${row("Problem It Solves", problemSolved)}
          ${row("Target Users", targetUsers)}
        `)}
        ${section("App Features", `
          ${row("Required Features", features)}
          ${row("Admin Dashboard Needed", hasAdminDashboard)}
          ${row("Users Upload Files", hasFileUpload)}
          ${row("Cloud Storage / Database", needsCloud)}
        `)}
        ${section("How the App Works", `
          ${row("Step-by-Step Description", howItWorks)}
          ${row("Reference Apps / Websites", referenceApps)}
        `)}
        ${section("Technical Requirements", `
          ${row("Login Types", loginTypes)}
          ${row("Online / Offline", onlineOffline)}
          ${row("Notifications Needed", notificationTypes)}
        `)}
        ${section("Design & Planning", `
          ${row("Has Logo / Design", hasLogo)}
          ${row("Expected Launch Date", launchDate)}
          ${row("Estimated Budget", budget)}
        `)}
        ${section("Additional Requirements", `
          ${row("Additional Notes", additionalNotes)}
          ${row("Special Instructions", specialInstructions)}
        `)}
      </table>

      <div style="margin-top:28px;text-align:center;color:#64748b;font-size:12px;border-top:1px solid #1e1040;padding-top:16px;">
        <p style="margin:0;">Submitted via Creative Hub website · creativehub2k@gmail.com</p>
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
