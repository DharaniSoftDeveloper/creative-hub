import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();
const fallbackContactEmail = "creativehub2k@gmail.com";
const fallbackContactPhone = process.env["CONTACT_PHONE"] || "9786954984";
const submissionsDir = path.resolve(process.cwd(), "submissions");
const submissionsFile = path.join(submissionsDir, "contact-requests.jsonl");

type ContactPayload = Record<string, string | undefined>;
type DeliveryStatus = "sent" | "queued" | "failed";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e1040;">
        <span style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(label)}</span>
        <p style="margin:4px 0 0;font-size:15px;color:#e2e8f0;white-space:pre-wrap;">${escapeHtml(value)}</p>
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

function buildCustomerConfirmationHtml({
  name,
  projectTitle,
  contactRecipient,
  contactPhone,
}: {
  name: string;
  projectTitle: string;
  contactRecipient: string;
  contactPhone: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#0f0a1e;color:#e2e8f0;padding:32px;border-radius:16px;border:1px solid #3b1fa8;">
      <h1 style="color:#a855f7;font-size:26px;margin:0 0 16px;">Creative Hub</h1>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
        We received your project request for <strong>${escapeHtml(projectTitle)}</strong>.
      </p>
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
        Our team will review it and get back to you soon. If you need to follow up, you can contact us directly at
        <a href="mailto:${escapeHtml(contactRecipient)}" style="color:#67e8f9;">${escapeHtml(contactRecipient)}</a>
        or call <a href="tel:${escapeHtml(contactPhone)}" style="color:#67e8f9;">${escapeHtml(contactPhone)}</a>.
      </p>
      <p style="font-size:16px;line-height:1.7;margin:0;">
        Thank you for reaching out to Creative Hub.
      </p>
    </div>
  `;
}

  // Helper to render a two-column label/value row for owner emails
  function mvRow(label: string, value: string | undefined) {
    if (!value) return "";
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1e1040;width:200px;vertical-align:top;font-size:13px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${escapeHtml(
          label,
        )}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1e1040;vertical-align:top;font-size:14px;color:#e2e8f0;white-space:pre-wrap;">${escapeHtml(
          value,
        )}</td>
      </tr>`;
  }

  // Build a structured, sectioned HTML email for the owner inbox
  function buildOwnerEmailHtml(payload: ContactPayload) {
    const {
      name,
      email,
      phone,
      orgName,
      projectTitle,
      projectType,
      purpose,
      problemSolved,
      targetUsers,
      features,
      hasAdminDashboard,
      hasFileUpload,
      needsCloud,
      howItWorks,
      referenceApps,
      loginTypes,
      onlineOffline,
      notificationTypes,
      hasLogo,
      launchDate,
      budget,
      additionalNotes,
      specialInstructions,
    } = payload;

    // Build a dark-themed two-column layout with boxed sections and clear label/value columns
    return `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:0 auto;background:#0f0a1e;color:#e2e8f0;padding:0;border-radius:10px;border:1px solid #2b1a49;overflow:hidden;">
        <div style="background:#120827;padding:20px 22px;border-bottom:1px solid #3b1fa8;text-align:center;">
          <h1 style="margin:0;color:#a855f7;font-size:22px;letter-spacing:1px;">Creative Hub</h1>
          <div style="color:#9ca3af;font-size:12px;margin-top:6px;">New Project Request Received</div>
        </div>

        <div style="display:flex;gap:18px;padding:18px;background:linear-gradient(180deg,#0b0816, #0f0a1e);">
          <div style="width:38%;">
            <div style="background:#0b1020;border:1px solid #24123e;border-radius:8px;padding:12px;margin-bottom:14px;">
              <div style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #32184a;padding-bottom:8px;margin-bottom:8px;font-weight:700;">Contact Details</div>
              <table style="width:100%;border-collapse:collapse;color:#cbd5e1;font-size:13px;">
                ${mvRow("Full Name", name)}
                ${mvRow("Email", email)}
                ${mvRow("Phone", phone)}
                ${mvRow("Business / Company", orgName)}
                ${mvRow("Project Name", projectTitle)}
                ${mvRow("Platforms", projectType)}
              </table>
            </div>

            <div style="background:#0b1020;border:1px solid #24123e;border-radius:8px;padding:12px;">
              <div style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #32184a;padding-bottom:8px;margin-bottom:8px;font-weight:700;">Design & Planning</div>
              <table style="width:100%;border-collapse:collapse;color:#cbd5e1;font-size:13px;">
                ${mvRow("Has Logo", hasLogo)}
                ${mvRow("Launch Date", launchDate)}
                ${mvRow("Budget", budget)}
              </table>
            </div>
          </div>

          <div style="flex:1;">
            <div style="background:#0b1020;border:1px solid #24123e;border-radius:8px;padding:12px;margin-bottom:14px;">
              <div style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #32184a;padding-bottom:8px;margin-bottom:8px;font-weight:700;">Project Overview</div>
              <table style="width:100%;border-collapse:collapse;color:#cbd5e1;font-size:13px;">
                ${mvRow("Purpose", purpose)}
                ${mvRow("Problem It Solves", problemSolved)}
                ${mvRow("Target Users", targetUsers)}
              </table>
            </div>

            <div style="background:#0b1020;border:1px solid #24123e;border-radius:8px;padding:12px;margin-bottom:14px;">
              <div style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #32184a;padding-bottom:8px;margin-bottom:8px;font-weight:700;">App Features</div>
              <table style="width:100%;border-collapse:collapse;color:#cbd5e1;font-size:13px;">
                ${mvRow("Required Features", features)}
                ${mvRow("Admin Dashboard", hasAdminDashboard)}
                ${mvRow("File Upload", hasFileUpload)}
                ${mvRow("Cloud Storage / DB", needsCloud)}
              </table>
            </div>

            <div style="background:#0b1020;border:1px solid #24123e;border-radius:8px;padding:12px;margin-bottom:14px;">
              <div style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #32184a;padding-bottom:8px;margin-bottom:8px;font-weight:700;">How The App Works</div>
              <div style="color:#cbd5e1;font-size:13px;white-space:pre-wrap;">${escapeHtml(howItWorks || "")}</div>
            </div>

            <div style="background:#0b1020;border:1px solid #24123e;border-radius:8px;padding:12px;">
              <div style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;border-bottom:1px solid #32184a;padding-bottom:8px;margin-bottom:8px;font-weight:700;">Technical Requirements</div>
              <table style="width:100%;border-collapse:collapse;color:#cbd5e1;font-size:13px;">
                ${mvRow("Login Types", loginTypes)}
                ${mvRow("Online / Offline", onlineOffline)}
                ${mvRow("Notifications", notificationTypes)}
                ${mvRow("Reference Apps", referenceApps)}
              </table>
            </div>
          </div>
        </div>

        <div style="padding:12px 18px;border-top:1px solid #24123e;background:#0b0816;color:#8b99a6;font-size:12px;">Submitted via Creative Hub website · ${escapeHtml(
          process.env["CONTACT_TO_EMAIL"] || fallbackContactEmail,
        )}</div>
      </div>
    `;
  }

function getMailTransport() {
  const smtpHost = process.env["SMTP_HOST"]?.trim();
  const smtpUser = process.env["SMTP_USER"]?.trim();
  const smtpPass = process.env["SMTP_PASS"];
  const smtpPort = Number(process.env["SMTP_PORT"] || "587");
  const smtpSecure = process.env["SMTP_SECURE"] === "true";

  if (smtpHost && smtpUser && smtpPass && Number.isFinite(smtpPort)) {
    return {
      fromAddress: process.env["CONTACT_FROM_EMAIL"] || smtpUser,
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      }),
    };
  }

  const gmailUser = process.env["GMAIL_USER"]?.trim();
  const gmailPass = process.env["GMAIL_APP_PASSWORD"]?.replace(/\s+/g, "");

  if (gmailUser && gmailPass) {
    return {
      fromAddress: process.env["CONTACT_FROM_EMAIL"] || gmailUser,
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      }),
    };
  }

  return null;
}

function saveSubmission(
  payload: ContactPayload,
  deliveryStatus: DeliveryStatus,
) {
  fs.mkdirSync(submissionsDir, { recursive: true });
  const record = {
    receivedAt: new Date().toISOString(),
    deliveryStatus,
    payload,
  };
  fs.appendFileSync(submissionsFile, `${JSON.stringify(record)}\n`, "utf8");
}

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
    contactMethod,
    purpose,
    problemSolved,
    targetUsers,
    hasAdminDashboard,
    hasFileUpload,
    needsCloud,
    referenceApps,
    loginTypes,
    onlineOffline,
    notificationTypes,
    hasLogo,
    launchDate,
    budget,
    specialInstructions,
  } = req.body as Record<string, string>;

  if (!name || !email || !projectTitle || !howItWorks) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const payload: ContactPayload = {
    name,
    email,
    phone,
    orgName,
    projectTitle,
    projectType,
    howItWorks,
    features,
    additionalNotes,
    contactMethod,
    purpose,
    problemSolved,
    targetUsers,
    hasAdminDashboard,
    hasFileUpload,
    needsCloud,
    referenceApps,
    loginTypes,
    onlineOffline,
    notificationTypes,
    hasLogo,
    launchDate,
    budget,
    specialInstructions,
  };
  const contactRecipient =
    process.env["CONTACT_TO_EMAIL"] || fallbackContactEmail;
  const mailTransport = getMailTransport();

  const html = buildOwnerEmailHtml(payload);

  if (!mailTransport) {
    saveSubmission(payload, "queued");
    req.log?.warn(
      { email, projectTitle },
      "Email service not configured; request saved locally",
    );
    res.status(202).json({
      success: true,
      queued: true,
      message: `Your request was saved successfully. Email delivery is not configured yet, so please also contact us at ${contactRecipient} or ${fallbackContactPhone}.`,
    });
    return;
  }

  saveSubmission(payload, "queued");
  res.json({
    success: true,
    queued: false,
    message: "Your request has been received successfully!",
  });

  void (async () => {
    try {
      await mailTransport.transporter.sendMail({
        from: `"Creative Hub Website" <${mailTransport.fromAddress}>`,
        to: contactRecipient,
        subject: `New Project Request: ${projectTitle}`,
        html,
        replyTo: email,
      });

      let confirmationSent = false;

      try {
        await mailTransport.transporter.sendMail({
          from: `"Creative Hub" <${mailTransport.fromAddress}>`,
          to: email,
          subject: `We received your request for ${projectTitle}`,
          html: buildCustomerConfirmationHtml({
            name,
            projectTitle,
            contactRecipient,
            contactPhone: fallbackContactPhone,
          }),
          replyTo: contactRecipient,
        });
        confirmationSent = true;
      } catch (confirmationErr) {
        req.log?.warn(
          { err: confirmationErr, email, projectTitle },
          "Owner email sent, but confirmation email failed",
        );
      }

      saveSubmission(payload, "sent");
      req.log?.info(
        { name, projectTitle, confirmationSent },
        "Contact email sent",
      );
    } catch (err) {
      saveSubmission(payload, "failed");
      req.log?.error(
        { err },
        "Failed to send contact email; request saved locally",
      );
    }
  })();
});

export default router;
