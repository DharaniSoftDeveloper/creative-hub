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

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#0f0a1e;color:#e2e8f0;padding:32px;border-radius:16px;border:1px solid #3b1fa8;">
      <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #3b1fa8;">
        <h1 style="color:#a855f7;font-size:26px;margin:0 0 4px;">Creative Hub</h1>
        <p style="color:#94a3b8;margin:0;font-size:14px;">New Project Request Received</p>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${section(
          "Basic Information",
          `
          ${row("Full Name", name)}
          ${row("Business / Company", orgName)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Preferred Contact", contactMethod)}
        `,
        )}
        ${section(
          "Project Overview",
          `
          ${row("App / Project Name", projectTitle)}
          ${row("Platform(s)", projectType)}
          ${row("Main Purpose", purpose)}
          ${row("Problem It Solves", problemSolved)}
          ${row("Target Users", targetUsers)}
        `,
        )}
        ${section(
          "App Features",
          `
          ${row("Required Features", features)}
          ${row("Admin Dashboard Needed", hasAdminDashboard)}
          ${row("Users Upload Files", hasFileUpload)}
          ${row("Cloud Storage / Database", needsCloud)}
        `,
        )}
        ${section(
          "How the App Works",
          `
          ${row("Step-by-Step Description", howItWorks)}
          ${row("Reference Apps / Websites", referenceApps)}
        `,
        )}
        ${section(
          "Technical Requirements",
          `
          ${row("Login Types", loginTypes)}
          ${row("Online / Offline", onlineOffline)}
          ${row("Notifications Needed", notificationTypes)}
        `,
        )}
        ${section(
          "Design & Planning",
          `
          ${row("Has Logo / Design", hasLogo)}
          ${row("Expected Launch Date", launchDate)}
          ${row("Estimated Budget", budget)}
        `,
        )}
        ${section(
          "Additional Requirements",
          `
          ${row("Additional Notes", additionalNotes)}
          ${row("Special Instructions", specialInstructions)}
        `,
        )}
      </table>

      <div style="margin-top:28px;text-align:center;color:#64748b;font-size:12px;border-top:1px solid #1e1040;padding-top:16px;">
        <p style="margin:0;">Submitted via Creative Hub website · ${escapeHtml(contactRecipient)}</p>
      </div>
    </div>
  `;

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

  try {
    await mailTransport.transporter.sendMail({
      from: `"Creative Hub Website" <${mailTransport.fromAddress}>`,
      to: contactRecipient,
      subject: `New Project Request: ${projectTitle}`,
      html,
      replyTo: email,
    });

    saveSubmission(payload, "sent");
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

    req.log?.info(
      { name, projectTitle, confirmationSent },
      "Contact email sent",
    );
    res.json({
      success: true,
      queued: false,
      confirmationSent,
      message: confirmationSent
        ? "Your request has been sent successfully!"
        : "Your request was sent successfully, but we could not deliver the confirmation email to you.",
    });
  } catch (err) {
    saveSubmission(payload, "failed");
    req.log?.error(
      { err },
      "Failed to send contact email; request saved locally",
    );
    res.status(202).json({
      success: true,
      queued: true,
      message: `Your request was saved, but we could not deliver the email automatically right now. Please also contact us at ${contactRecipient} or ${fallbackContactPhone}.`,
    });
  }
});

export default router;
