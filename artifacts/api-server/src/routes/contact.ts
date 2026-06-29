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

    // Build a compact top summary and a full, readable details block similar to the screenshots
    const summaryRows = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Business", orgName],
      ["Project", projectTitle],
      ["Platforms", projectType],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e6eef8;font-weight:600;color:#0b3a66;width:140px;vertical-align:top;background:#f3f8ff;">${escapeHtml(
            k,
          )}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e6eef8;vertical-align:top;color:#0b2540;">${escapeHtml(
            v,
          )}</td>
        </tr>`)
      .join("");

    const detailLines = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Business", orgName],
      ["Project", projectTitle],
      ["Platforms", projectType],
      ["Purpose", purpose],
      ["Problem Solved", problemSolved],
      ["Target Users", targetUsers],
      ["Features", features],
      ["Admin Dashboard", hasAdminDashboard],
      ["File Upload", hasFileUpload],
      ["Needs Cloud", needsCloud],
      ["How It Works", howItWorks],
      ["Reference Apps", referenceApps],
      ["Login Types", loginTypes],
      ["Online / Offline", onlineOffline],
      ["Notifications", notificationTypes],
      ["Has Logo", hasLogo],
      ["Launch Date", launchDate],
      ["Budget", budget],
      ["Additional Notes", additionalNotes],
      ["Special Instructions", specialInstructions],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\\n\\n");

    return `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:0 auto;background:#ffffff;color:#0b2540;padding:0;border-radius:8px;border:1px solid #e6eef8;overflow:hidden;">
        <div style="background:#1e3a8a;color:#ffffff;padding:16px 20px;">
          <h2 style="margin:0;font-size:18px;">Creative Hub</h2>
          <div style="font-size:13px;opacity:0.95;margin-top:4px;">New Project Request Received</div>
        </div>

        <div style="padding:18px;">
          <table style="width:100%;border-collapse:collapse;background:transparent;margin-bottom:16px;">
            <tbody>
              ${summaryRows}
            </tbody>
          </table>

          <div style="border:1px solid #eef6ff;border-radius:6px;padding:12px;background:#fbfdff;color:#06223a;font-size:13px;white-space:pre-wrap;line-height:1.45;">
            ${escapeHtml(detailLines)}
          </div>
        </div>

        <div style="padding:12px 18px;border-top:1px solid #eef6ff;background:#f8fbff;color:#6b7280;font-size:12px;">Submitted via Creative Hub · ${escapeHtml(
          process.env["CONTACT_TO_EMAIL"] || fallbackContactEmail,
        )} · ${escapeHtml(new Date().toLocaleString())}</div>
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
