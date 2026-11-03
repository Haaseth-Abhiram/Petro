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

    const sub = subject || `Contact Enquiry - ${division || "General"}`;

    const res = await query(
      `INSERT INTO contact_messages (full_name, company_name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING id, full_name, created_at;`,
      [fullName, companyName || "", email, phone || "", sub, message]
    );

    const enquiryRecord = res.rows[0];

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
      message: "Your enquiry has been received and logged in our system.",
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
