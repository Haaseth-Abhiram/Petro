import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendRfqStatusUpdateEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      companyName,
      email,
      phone,
      industry,
      productCategory,
      productName,
      quantity,
      unitOfMeasurement,
      technicalSpecifications,
      deliveryLocation,
      requiredDeliveryDate,
      additionalComments,
      attachmentName,
    } = body;

    const safeCompany = (companyName && String(companyName).trim()) || "Direct Client / Individual";
    const safeProduct =
      (productName && String(productName).trim()) ||
      (productCategory && String(productCategory).trim()) ||
      "Instrumentation & Valves Specification";

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, message: "Full name and email are required to request a quote." },
        { status: 400 }
      );
    }

    const res = await query(
      `INSERT INTO rfq_submissions (
        full_name, company_name, email, phone, industry,
        product_category, product_name, quantity, unit_of_measurement,
        technical_specifications, delivery_location, required_delivery_date,
        additional_comments, attachment_name, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'new')
      RETURNING id, full_name, company_name, product_name, created_at;`,
      [
        fullName,
        safeCompany,
        email,
        phone || "",
        industry || "Instrumentation",
        productCategory || "Instrumentation & Valves",
        safeProduct,
        quantity ? String(quantity) : "1",
        unitOfMeasurement || "Pcs",
        technicalSpecifications || "",
        deliveryLocation || "",
        requiredDeliveryDate || "",
        additionalComments || "",
        attachmentName || "",
      ]
    );

    const rfqRecord = res.rows[0];

    // Send acknowledgement email to client's registered email
    try {
      await sendRfqStatusUpdateEmail({
        id: rfqRecord.id,
        fullName: fullName,
        email: email,
        companyName: safeCompany,
        productName: safeProduct,
        quantity: quantity ? `${quantity} ${unitOfMeasurement || "Pcs"}` : undefined,
        status: "new",
        isNew: true,
      });
    } catch (emailErr: any) {
      console.warn("RFQ initial confirmation email failed:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Quotation request successfully submitted to our engineering desk.",
      rfqId: rfqRecord.id,
    });
  } catch (err: any) {
    console.error("RFQ API error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to submit quote request.", error: err.message },
      { status: 500 }
    );
  }
}
