import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEnquiryStatusUpdateEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, companyName, email, phone, division, message, subject } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const sub =
      subject ||
      (division === "Suggestion" || /suggestion|feedback/i.test(division || "")
        ? "Website suggestion"
        : `Contact Enquiry - ${division || "General"}`);

    const res = await query(
      `INSERT INTO contact_messages (full_name, company_name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING id, full_name, created_at;`,
      [fullName, companyName || "", email, phone || "", sub, message]
    );

    const enquiryRecord = res.rows[0];

    // If this inquiry is about instruments, also create an RFQ record in rfq_submissions
    // so it immediately displays in RFQ in the Admin Portal!
    const isInstrument =
      /instrument|valve|fitting|tubing|analyser|impulse|manifold/i.test(division || "") ||
      /instrument|valve|fitting|tubing|analyser|impulse|manifold/i.test(sub || "") ||
      /instrument|valve|fitting|tubing|analyser|impulse|manifold/i.test(message || "");

    if (isInstrument) {
      try {
        await query(
          `INSERT INTO rfq_submissions (
            full_name, company_name, email, phone, industry,
            product_category, product_name, quantity, unit_of_measurement,
            technical_specifications, additional_comments, status
          ) VALUES ($1, $2, $3, $4, 'Instrumentation & Process Control', $5, $6, '1', 'Set / Lot', $7, $8, 'new');`,
          [
            fullName,
            companyName || "Direct Inquiry",
            email,
            phone || "",
            division || "Instrumentation & Valves",
            sub || "Instrumentation Inquiry",
            message,
            message,
          ]
        );
      } catch (rfqErr: any) {
        console.warn("Failed to mirror instrument enquiry into rfq_submissions:", rfqErr.message);
      }
    }

    // Send acknowledgement email to client's registered email
    try {
      await sendEnquiryStatusUpdateEmail({
        id: enquiryRecord.id,
        fullName: fullName,
        email: email,
        companyName: companyName,
        subject: sub,
        status: "new",
        isNew: true,
      });
    } catch (emailErr: any) {
      console.warn("Contact enquiry initial confirmation email failed:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been received and logged in our system.",
      enquiryId: enquiryRecord.id,
    });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to submit enquiry.", error: err.message },
      { status: 500 }
    );
  }
}
