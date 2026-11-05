/**
 * Utilities for composing pre-filled emails with mailto and webmail redirects.
 */

export function buildEnquiryEmailContent(enq: {
  full_name?: string;
  email: string;
  company_name?: string;
  phone?: string;
  subject?: string;
  message?: string;
  created_at?: string;
}) {
  const name = (enq.full_name || "").trim() || "Valued Customer";
  const subject = `RE: ${(enq.subject || "Enquiry").trim()} - Petro Engineering`;

  const dateStr = enq.created_at
    ? new Date(enq.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const body = `Dear ${name},

Thank you for contacting Petro Engineering. We have received your enquiry regarding "${(enq.subject || "our products/services").trim()}".

[Please enter your response here]

--------------------------------------------------
Original Enquiry Summary:
- Customer: ${name}
- Company: ${enq.company_name || "Direct Website Submission"}
- Phone: ${enq.phone || "Not provided"}
- Date Received: ${dateStr}
- Original Message:
${(enq.message || "").trim()}
--------------------------------------------------

Best regards,
Petro Engineering Private Limited
Plot No. 12, Industrial Area, Hyderabad, India
Website: https://petroeng.in
Email: sales@petroeng.in
`;

  return { subject, body, to: enq.email };
}

export function buildRfqEmailContent(rfq: {
  id?: string;
  full_name?: string;
  email: string;
  company_name?: string;
  phone?: string;
  product_name?: string;
  quantity?: string;
  unit_of_measurement?: string;
  required_delivery_date?: string;
  delivery_location?: string;
  notes?: string;
  created_at?: string;
}) {
  const name = (rfq.full_name || "").trim() || "Sir/Madam";
  const comp = (rfq.company_name || "").trim() || "your organization";
  const prod = (rfq.product_name || "Industrial Equipment").trim();
  const subject = `Quotation for ${prod} - Petro Engineering`;

  const dateStr = rfq.created_at
    ? new Date(rfq.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const body = `Dear ${name},

Thank you for your Request for Quotation (RFQ) on behalf of ${comp}.

We are pleased to provide details for your requirement of "${prod}":

- Product / Service: ${prod}
- Quantity: ${rfq.quantity || "1"} ${rfq.unit_of_measurement || "Pcs"}
- Required Delivery: ${rfq.required_delivery_date || "Standard lead time"}
- Destination: ${rfq.delivery_location || "As specified"}

[Please enter pricing, terms of delivery, payment terms, and validity here]

--------------------------------------------------
Original RFQ Information:
- Company: ${rfq.company_name || "Direct Submission"}
- Contact Person: ${name}
- Phone: ${rfq.phone || "Not provided"}
- Date Received: ${dateStr}
- Additional Specifications / Notes:
${(rfq.notes || "None provided").trim()}
--------------------------------------------------

We look forward to partnering with you.

Best regards,
Estimations & Sales Team
Petro Engineering Private Limited
Website: https://petroeng.in
Email: sales@petroeng.in
`;

  return { subject, body, to: rfq.email };
}

export function getMailtoLink(to: string, subject: string, body: string): string {
  const encTo = encodeURIComponent(to.trim());
  const encSub = encodeURIComponent(subject.trim());
  const encBody = encodeURIComponent(body);
  return `mailto:${encTo}?subject=${encSub}&body=${encBody}`;
}

export function getGmailComposeLink(to: string, subject: string, body: string): string {
  const encTo = encodeURIComponent(to.trim());
  const encSub = encodeURIComponent(subject.trim());
  const encBody = encodeURIComponent(body);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encTo}&su=${encSub}&body=${encBody}`;
}
