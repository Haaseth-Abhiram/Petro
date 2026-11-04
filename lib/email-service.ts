import nodemailer from "nodemailer";
import { query } from "@/lib/db";

interface SendEmailParams {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  type: "rfq_submission" | "rfq_update" | "enquiry_submission" | "enquiry_update" | "career_application" | "general";
  referenceId?: string;
}

/**
 * Configure Nodemailer SMTP Transporter
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Core sendEmail function
 * Sends via SMTP if configured, logs every transaction to PostgreSQL email_logs table.
 */
export async function sendEmail({
  to,
  toName,
  subject,
  html,
  text,
  type,
  referenceId,
}: SendEmailParams): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
  const from = process.env.SMTP_FROM || `"Petro Engineering Desk" <notifications@petroeng.in>`;
  const transporter = getTransporter();

  let emailStatus = "logged";
  let errorMessage: string | null = null;
  let messageId: string | undefined;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to: toName ? `"${toName}" <${to}>` : to,
        subject,
        text: text || subject,
        html,
      });
      emailStatus = "sent";
      messageId = info.messageId;
      console.log(`✓ Email dispatched via SMTP to ${to} (MessageId: ${info.messageId})`);
    } catch (err: any) {
      console.error(`✗ SMTP delivery failed to ${to}:`, err.message);
      emailStatus = "failed";
      errorMessage = err.message;
    }
  } else {
    // Development or SMTP unconfigured: Log to database and console
    console.log(`[EMAIL DISPATCH] To: ${to} | Subject: "${subject}" | Type: ${type} | Ref: ${referenceId || "N/A"}`);
    emailStatus = "queued_or_simulated";
  }

  // Persist delivery record to Supabase database email_logs
  try {
    await query(
      `INSERT INTO email_logs (recipient_email, recipient_name, subject, email_type, reference_id, status, error_message)
       VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [to, toName || "", subject, type, referenceId || null, emailStatus, errorMessage]
    );
  } catch (dbErr: any) {
    console.warn("Could not save to email_logs table:", dbErr.message);
  }

  return {
    success: emailStatus !== "failed",
    simulated: !transporter,
    messageId,
    error: errorMessage || undefined,
  };
}

/**
 * Brand Wrapper for HTML emails
 */
function wrapBrandTemplate(title: string, badgeText: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F5F6F7;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #17191C;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 620px;
      margin: 32px auto;
      background: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #D8DDE2;
      box-shadow: 0 4px 20px rgba(23, 25, 28, 0.05);
    }
    .header {
      background: #17191C;
      padding: 28px 32px;
      text-align: left;
      border-bottom: 3px solid #FF4B32;
    }
    .header-title {
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }
    .header-sub {
      color: #929DA7;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    .body {
      padding: 32px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: #FF4B32;
      color: #FFFFFF;
      margin-bottom: 16px;
    }
    .heading {
      font-size: 20px;
      font-weight: 800;
      color: #17191C;
      margin: 0 0 16px 0;
      line-height: 1.3;
    }
    .text {
      font-size: 14px;
      color: #5F6871;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: #F5F6F7;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #D8DDE2;
    }
    .details-table td {
      padding: 12px 16px;
      font-size: 13px;
      border-bottom: 1px solid #D8DDE2;
    }
    .details-table tr:last-child td {
      border-bottom: none;
    }
    .details-label {
      color: #5F6871;
      font-weight: 700;
      width: 38%;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    .details-val {
      color: #17191C;
      font-weight: 600;
    }
    .notes-box {
      background: #FFF8F6;
      border-left: 4px solid #FF4B32;
      padding: 14px 18px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
      font-size: 13px;
      color: #17191C;
      line-height: 1.5;
    }
    .footer {
      background: #F5F6F7;
      padding: 24px 32px;
      border-top: 1px solid #D8DDE2;
      font-size: 12px;
      color: #5F6871;
      line-height: 1.5;
      text-align: center;
    }
    .footer-links a {
      color: #FF4B32;
      text-decoration: none;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-title">Petro Engineering</div>
      <div class="header-sub">Industrial Solutions & Precision Sourcing</div>
    </div>
    <div class="body">
      <span class="badge">${badgeText}</span>
      <h1 class="heading">${title}</h1>
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #17191C;">Petro Engineering Private Limited</p>
      <p style="margin: 0 0 12px 0;">Procurement & Technical Sourcing Desk • Visakhapatnam, Andhra Pradesh, India</p>
      <div class="footer-links">
        <a href="mailto:procurement@petroeng.in">procurement@petroeng.in</a> • 
        <span>+91 98480 32919</span>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Format Status Names for Human Readers
 */
function formatRfqStatus(status: string): { label: string; description: string } {
  switch (status) {
    case "new":
      return {
        label: "New (Pending Review)",
        description: "Your quotation request has been received and queued at our procurement desk.",
      };
    case "under_review":
      return {
        label: "Under Review / TBE",
        description: "Your line specifications are currently undergoing Technical Bid Evaluation (TBE) by our engineering team.",
      };
    case "awaiting_info":
      return {
        label: "Awaiting Client Info",
        description: "Our engineering desk requires additional technical clarifications or line specifications to proceed.",
      };
    case "quoted":
      return {
        label: "Quotation Sent (Quoted)",
        description: "Your official commercial & technical quotation has been formulated by our procurement team.",
      };
    case "completed":
      return {
        label: "Completed / Won",
        description: "Your procurement order has been successfully fulfilled and processed.",
      };
    case "resubmitted":
      return {
        label: "Resubmitted / Reopened",
        description: "Your specification docket has been resubmitted for active engineering re-evaluation.",
      };
    case "rejected":
      return {
        label: "Rejected / Closed",
        description: "This quotation request docket has been closed. Please see notes or contact our engineering desk.",
      };
    default:
      return {
        label: status.toUpperCase(),
        description: "Your quotation status has been updated in our database.",
      };
  }
}

function formatEnquiryStatus(status: string): { label: string; description: string } {
  switch (status) {
    case "new":
      return {
        label: "New",
        description: "Your contact enquiry has been logged into our support ticketing system.",
      };
    case "in_progress":
      return {
        label: "In Progress",
        description: "Our technical division is actively reviewing your message and preparing a response.",
      };
    case "responded":
      return {
        label: "Responded",
        description: "Our customer engineering team has responded to your inquiry.",
      };
    case "closed":
      return {
        label: "Closed",
        description: "Your enquiry ticket has been marked as completed and resolved.",
      };
    default:
      return {
        label: status.toUpperCase(),
        description: "Your enquiry status has been updated.",
      };
  }
}

/**
 * Send RFQ Status Update Email
 */
export async function sendRfqStatusUpdateEmail(data: {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  productName: string;
  quantity?: string;
  status: string;
  quoteAmount?: number | null;
  internalNotes?: string | null;
  isNew?: boolean;
}) {
  const { label, description } = formatRfqStatus(data.status);
  const subject = data.isNew
    ? `[Petro Engineering] RFQ Received: ${data.productName} (Ref: #${data.id.slice(0, 8)})`
    : `[Petro Engineering] RFQ Update: ${data.productName} — ${label} (Ref: #${data.id.slice(0, 8)})`;

  const contentHtml = `
    <p class="text">Dear <strong>${data.fullName}</strong>,</p>
    <p class="text">${description}</p>

    <table class="details-table">
      <tr>
        <td class="details-label">Docket Ref:</td>
        <td class="details-val">#${data.id.slice(0, 8).toUpperCase()}</td>
      </tr>
      <tr>
        <td class="details-label">Company:</td>
        <td class="details-val">${data.companyName}</td>
      </tr>
      <tr>
        <td class="details-label">Requested Item:</td>
        <td class="details-val">${data.productName}</td>
      </tr>
      ${
        data.quantity
          ? `<tr>
              <td class="details-label">Quantity:</td>
              <td class="details-val">${data.quantity}</td>
            </tr>`
          : ""
      }
      <tr>
        <td class="details-label">Workflow Status:</td>
        <td class="details-val"><strong style="color: #FF4B32;">${label}</strong></td>
      </tr>
      ${
        data.quoteAmount != null
          ? `<tr>
              <td class="details-label">Quoted Price:</td>
              <td class="details-val"><strong style="color: #17191C; font-size: 15px;">$ ${Number(data.quoteAmount).toLocaleString()}</strong></td>
            </tr>`
          : ""
      }
    </table>

    ${
      data.internalNotes
        ? `
        <div class="notes-box">
          <strong style="display: block; font-size: 11px; text-transform: uppercase; color: #FF4B32; margin-bottom: 4px;">Procurement Desk Notes:</strong>
          ${data.internalNotes.replace(/\n/g, "<br/>")}
        </div>`
        : ""
    }

    <p class="text" style="margin-top: 24px;">
      If you have questions or require technical datasheets, simply reply directly to this email or contact your assigned procurement officer.
    </p>
  `;

  const html = wrapBrandTemplate(
    data.isNew ? "Quotation Request Acknowledged" : "Quotation Specification Update",
    label,
    contentHtml
  );

  return sendEmail({
    to: data.email,
    toName: data.fullName,
    subject,
    html,
    type: data.isNew ? "rfq_submission" : "rfq_update",
    referenceId: data.id,
  });
}

/**
 * Send Contact Enquiry Status Update Email
 */
export async function sendEnquiryStatusUpdateEmail(data: {
  id: string;
  fullName: string;
  email: string;
  companyName?: string | null;
  subject: string;
  status: string;
  internalNotes?: string | null;
  isNew?: boolean;
}) {
  const { label, description } = formatEnquiryStatus(data.status);
  const emailSubject = data.isNew
    ? `[Petro Engineering] Enquiry Received: ${data.subject} (Ticket: #${data.id.slice(0, 8)})`
    : `[Petro Engineering] Update on Enquiry: ${data.subject} — ${label} (Ticket: #${data.id.slice(0, 8)})`;

  const contentHtml = `
    <p class="text">Dear <strong>${data.fullName}</strong>,</p>
    <p class="text">${description}</p>

    <table class="details-table">
      <tr>
        <td class="details-label">Ticket ID:</td>
        <td class="details-val">#${data.id.slice(0, 8).toUpperCase()}</td>
      </tr>
      ${
        data.companyName
          ? `<tr>
              <td class="details-label">Organization:</td>
              <td class="details-val">${data.companyName}</td>
            </tr>`
          : ""
      }
      <tr>
        <td class="details-label">Subject:</td>
        <td class="details-val">${data.subject}</td>
      </tr>
      <tr>
        <td class="details-label">Current Status:</td>
        <td class="details-val"><strong style="color: #FF4B32;">${label}</strong></td>
      </tr>
    </table>

    ${
      data.internalNotes
        ? `
        <div class="notes-box">
          <strong style="display: block; font-size: 11px; text-transform: uppercase; color: #FF4B32; margin-bottom: 4px;">Technical Desk Response:</strong>
          ${data.internalNotes.replace(/\n/g, "<br/>")}
        </div>`
        : ""
    }

    <p class="text" style="margin-top: 24px;">
      Thank you for choosing Petro Engineering. We are committed to responding to industrial inquiries with precision and speed.
    </p>
  `;

  const html = wrapBrandTemplate(
    data.isNew ? "Customer Enquiry Received" : "Enquiry Resolution Update",
    label,
    contentHtml
  );

  return sendEmail({
    to: data.email,
    toName: data.fullName,
    subject: emailSubject,
    html,
    type: data.isNew ? "enquiry_submission" : "enquiry_update",
    referenceId: data.id,
  });
}


export interface CareerEmailData {
  id: string;
  applicationReference: string;
  fullName: string;
  email: string;
  role: string;
  experience: string;
}

export async function sendCareerApplicationEmail(data: CareerEmailData) {
  const emailSubject = `Application Received [${data.applicationReference}] — ${data.role} | Petro Engineering`;

  const contentHtml = `
    <p class="text">Dear <strong>${data.fullName}</strong>,</p>
    <p class="text">
      Thank you for submitting your application to join the team at <strong>Petro Engineering</strong>. 
      We have successfully received your credentials and resume.
    </p>

    <table class="details-table">
      <tr>
        <td class="details-label">Reference ID:</td>
        <td class="details-val"><strong>${data.applicationReference}</strong></td>
      </tr>
      <tr>
        <td class="details-label">Position of Interest:</td>
        <td class="details-val"><strong>${data.role}</strong></td>
      </tr>
      <tr>
        <td class="details-label">Experience Bracket:</td>
        <td class="details-val">${data.experience}</td>
      </tr>
      <tr>
        <td class="details-label">Initial Status:</td>
        <td class="details-val"><strong style="color: #FF4B32;">New / Under Review</strong></td>
      </tr>
    </table>

    <div class="notes-box">
      <strong style="display: block; font-size: 11px; text-transform: uppercase; color: #FF4B32; margin-bottom: 4px;">Next Steps:</strong>
      Our engineering recruitment desk evaluates applications against current project requisitions. If your background matches our technical specifications, a member of our team will contact you directly to coordinate the interview process.
    </div>

    <p class="text" style="margin-top: 24px;">
      We appreciate your interest in building your career with Petro Engineering.
    </p>
  `;

  const html = wrapBrandTemplate(
    "Application Acknowledgement",
    "Application Received",
    contentHtml
  );

  return sendEmail({
    to: data.email,
    toName: data.fullName,
    subject: emailSubject,
    html,
    type: "career_application",
    referenceId: data.applicationReference,
  });
}
