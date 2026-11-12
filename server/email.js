const nodemailer = require("nodemailer");
const { query } = require("./db");

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

async function sendEmail({ to, toName, subject, html, text, type, referenceId }) {
  const from = process.env.SMTP_FROM || `"Petro Engineering Desk" <notifications@petroeng.in>`;
  const transporter = getTransporter();

  let emailStatus = "logged";
  let errorMessage = null;
  let messageId;

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
    } catch (err) {
      console.error(`✗ SMTP delivery failed to ${to}:`, err.message);
      emailStatus = "failed";
      errorMessage = err.message;
    }
  } else {
    emailStatus = "simulated";
    console.log(`[SMTP Not Configured] Simulated email to ${to}: "${subject}"`);
  }

  try {
    await query(
      `INSERT INTO email_logs (
        recipient_email, recipient_name, subject, email_type, reference_id,
        status, error_message, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());`,
      [to, toName || null, subject, type, referenceId ? String(referenceId) : null, emailStatus, errorMessage]
    );
  } catch (logErr) {
    console.warn("Could not write email audit log to database:", logErr.message);
  }

  return {
    success: emailStatus === "sent" || emailStatus === "simulated",
    simulated: emailStatus === "simulated",
    messageId,
    error: errorMessage || undefined,
  };
}

async function sendRfqStatusUpdateEmail({ id, fullName, email, companyName, productName, quantity, status, quoteAmount, internalNotes, isNew }) {
  const subject = isNew
    ? `Quotation Request Received [RFQ-${id}] - Petro Engineering`
    : `Quotation Status Updated [RFQ-${id}] - ${status?.toUpperCase()} - Petro Engineering`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #c80808; margin-top: 0;">Petro Engineering Private Limited</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>${isNew ? "Thank you for requesting a quotation. We have received your technical specifications." : `Your quotation request [RFQ-${id}] has been updated.`}</p>
      <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Company:</strong> ${companyName || "N/A"}</p>
        <p style="margin: 4px 0;"><strong>Product:</strong> ${productName || "Engineering item"}</p>
        ${quantity ? `<p style="margin: 4px 0;"><strong>Quantity:</strong> ${quantity}</p>` : ""}
        <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #c80808; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${status}</span></p>
        ${quoteAmount ? `<p style="margin: 4px 0;"><strong>Quoted Value:</strong> ₹${quoteAmount}</p>` : ""}
        ${internalNotes ? `<p style="margin: 4px 0;"><strong>Remarks:</strong> ${internalNotes}</p>` : ""}
      </div>
      <p style="color: #71717a; font-size: 13px;">For any questions, reply directly to this email or contact support@petroeng.in.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    toName: fullName,
    subject,
    html,
    type: isNew ? "rfq_submission" : "rfq_update",
    referenceId: String(id),
  });
}

async function sendEnquiryStatusUpdateEmail({ id, fullName, email, companyName, subject: sub, status, internalNotes, isNew }) {
  const subject = isNew
    ? `Enquiry Received [ENQ-${id}] - Petro Engineering`
    : `Enquiry Status Updated [ENQ-${id}] - ${status?.toUpperCase()} - Petro Engineering`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #c80808; margin-top: 0;">Petro Engineering Private Limited</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>${isNew ? "Thank you for contacting Petro Engineering. Our technical team has logged your inquiry." : `Your enquiry [ENQ-${id}] status has been updated.`}</p>
      <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Subject:</strong> ${sub || "Inquiry"}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> <span style="background: #c80808; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${status}</span></p>
        ${internalNotes ? `<p style="margin: 4px 0;"><strong>Response:</strong> ${internalNotes}</p>` : ""}
      </div>
      <p style="color: #71717a; font-size: 13px;">Petro Engineering Private Limited · Procurement &amp; Client Services</p>
    </div>
  `;

  return sendEmail({
    to: email,
    toName: fullName,
    subject,
    html,
    type: isNew ? "enquiry_submission" : "enquiry_update",
    referenceId: String(id),
  });
}

module.exports = {
  sendEmail,
  sendRfqStatusUpdateEmail,
  sendEnquiryStatusUpdateEmail,
};
