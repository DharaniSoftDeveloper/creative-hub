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

    return `
      <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;background:#0f0a1e;color:#e2e8f0;padding:28px;border-radius:12px;border:1px solid #3b1fa8;">
        <div style="text-align:center;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #3b1fa8;">
          <h1 style="color:#a855f7;font-size:24px;margin:0 0 6px;">Creative Hub</h1>
          <p style="color:#94a3b8;margin:0;font-size:13px;">New Project Request Received</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:12px;background:transparent;">
          <thead>
            <tr>
              <th colspan="2" style="background:#27448a;color:#fff;padding:10px 12px;text-align:left;border-radius:6px 6px 0 0;">Details</th>
            </tr>
          </thead>
          <tbody>
            ${mvRow("Full Name", name)}
            ${mvRow("Email", email)}
            ${mvRow("Phone", phone)}
            ${mvRow("Business / Company", orgName)}
            ${mvRow("Project Name", projectTitle)}
            ${mvRow("Platforms", projectType)}
          </tbody>
        </table>

        <table style="width:100%;border-collapse:collapse;margin-top:18px;">
          <tr>
            <td style="vertical-align:top;padding-right:18px;width:50%;">
              <p style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;border-bottom:1px solid #3b1fa8;padding-bottom:8px;">Project Overview</p>
              <table style="width:100%;border-collapse:collapse;">
                <tbody>
                  ${mvRow("Main Purpose", purpose)}
                  ${mvRow("Problem It Solves", problemSolved)}
                  ${mvRow("Target Users", targetUsers)}
                </tbody>
              </table>
            </td>
            <td style="vertical-align:top;padding-left:18px;width:50%;">
              <p style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;border-bottom:1px solid #3b1fa8;padding-bottom:8px;">App Features</p>
              <table style="width:100%;border-collapse:collapse;">
                <tbody>
                  ${mvRow("Required Features", features)}
                  ${mvRow("Admin Dashboard Needed", hasAdminDashboard)}
                  ${mvRow("Users Upload Files", hasFileUpload)}
                  ${mvRow("Cloud Storage / Database", needsCloud)}
                </tbody>
              </table>
            </td>
          </tr>
        </table>

        <div style="margin-top:18px;">
          <p style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;border-bottom:1px solid #3b1fa8;padding-bottom:8px;">How The App Works</p>
          <div style="background:transparent;padding:10px 12px;border:1px solid #1e1040;border-radius:8px;margin-top:8px;color:#e2e8f0;font-size:14px;white-space:pre-wrap;">${escapeHtml(
            howItWorks || "",
          )}</div>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-top:18px;">
          <thead>
            <tr>
              <th style="text-align:left;color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;padding-bottom:8px;border-bottom:1px solid #3b1fa8;">Technical Requirements</th>
            </tr>
          </thead>
          <tbody>
            ${mvRow("Login Types", loginTypes)}
            ${mvRow("Online / Offline", onlineOffline)}
            ${mvRow("Notifications Needed", notificationTypes)}
          </tbody>
        </table>

        <table style="width:100%;border-collapse:collapse;margin-top:18px;">
          <thead>
            <tr>
              <th style="text-align:left;color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;padding-bottom:8px;border-bottom:1px solid #3b1fa8;">Design & Planning</th>
            </tr>
          </thead>
          <tbody>
            ${mvRow("Has Logo / Design", hasLogo)}
            ${mvRow("Expected Launch Date", launchDate)}
            ${mvRow("Estimated Budget", budget)}
          </tbody>
        </table>

        <div style="margin-top:18px;">
          <p style="color:#a855f7;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;border-bottom:1px solid #3b1fa8;padding-bottom:8px;">Additional Requirements</p>
          <div style="background:transparent;padding:10px 12px;border:1px solid #1e1040;border-radius:8px;margin-top:8px;color:#e2e8f0;font-size:14px;white-space:pre-wrap;">${escapeHtml(
            additionalNotes || "",
          )}<br/>${escapeHtml(specialInstructions || "")}</div>
        </div>

        <div style="margin-top:20px;text-align:center;color:#64748b;font-size:12px;border-top:1px solid #1e1040;padding-top:12px;">Submitted via Creative Hub website · ${escapeHtml(
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
