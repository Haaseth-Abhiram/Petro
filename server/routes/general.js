const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { randomUUID } = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { query } = require("../db");
const { sendEnquiryStatusUpdateEmail, sendRfqStatusUpdateEmail } = require("../email");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gznvueeroscdfymfuyxf.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Uje5n9Scgfli0rncEI2qIw_dThOfEto";
const supabase = createClient(supabaseUrl, supabaseKey);

const rfqDir = path.resolve(process.cwd(), "uploads", "rfqs");
if (!fs.existsSync(rfqDir)) {
  fs.mkdirSync(rfqDir, { recursive: true });
}

const rfqUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, rfqDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const handleOptionalRfqUpload = (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return rfqUpload.single("attachment")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message || "Attachment upload failed." });
      }
      next();
    });
  }
  next();
};

const router = express.Router();

// GET /api/db-check
router.get("/db-check", async (req, res) => {
  try {
    const result = await query("SELECT NOW() as current_time, version() as pg_version, current_database() as database;");
    const row = result.rows[0];

    return res.json({
      status: "connected",
      message: "Successfully connected to Supabase PostgreSQL database.",
      timestamp: row.current_time,
      database: row.database,
      version: row.pg_version ? row.pg_version.split(" on ")[0] : "PostgreSQL",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to connect to Supabase database.",
      error: error.message,
    });
  }
});

// POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    const { fullName, companyName, email, phone, division, message, subject } = req.body || {};

    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required." });
    }

    const sub =
      subject ||
      (division === "Suggestion" || /suggestion|feedback/i.test(division || "")
        ? "Website suggestion"
        : `Contact Enquiry - ${division || "General"}`);

    const result = await query(
      `INSERT INTO contact_messages (full_name, company_name, email, phone, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING id, full_name, created_at;`,
      [fullName, companyName || "", email, phone || "", sub, message]
    );

    const enquiryRecord = result.rows[0];

    // If inquiry mentions instrumentation, also mirror to RFQ submissions table
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
      } catch (rfqErr) {
        console.warn("Failed to mirror instrument enquiry into rfq_submissions:", rfqErr.message);
      }
    }

    // Send confirmation email
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
    } catch (emailErr) {
      console.warn("Contact enquiry confirmation email failed:", emailErr.message);
    }

    return res.json({
      success: true,
      message: "Your message has been received and logged in our system.",
      enquiryId: enquiryRecord.id,
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit enquiry.", error: err.message });
  }
});

// POST /api/rfq
router.post("/rfq", handleOptionalRfqUpload, async (req, res) => {
  try {
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
    } = req.body || {};

    const safeCompany = (companyName && String(companyName).trim()) || "Direct Client / Individual";
    const safeProduct =
      (productName && String(productName).trim()) ||
      (productCategory && String(productCategory).trim()) ||
      "Instrumentation & Valves Specification";

    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: "Full name and email are required to request a quote." });
    }

    const uploadedFile = req.file;
    const finalAttachmentName = uploadedFile ? uploadedFile.originalname : (attachmentName || "");
    const finalAttachmentSize = uploadedFile ? Math.round(uploadedFile.size) : null;
    let finalAttachmentPath = uploadedFile ? `uploads/rfqs/${uploadedFile.filename}` : null;

    if (uploadedFile && fs.existsSync(uploadedFile.path)) {
      try {
        const fileBuffer = fs.readFileSync(uploadedFile.path);
        const cloudPath = `rfqs/${Date.now()}-${uploadedFile.originalname}`;
        const { error: cloudErr } = await supabase.storage
          .from("uploads")
          .upload(cloudPath, fileBuffer, {
            contentType: uploadedFile.mimetype || "application/octet-stream",
            upsert: true,
          });
        if (!cloudErr) {
          const { data: pub } = supabase.storage.from("uploads").getPublicUrl(cloudPath);
          if (pub?.publicUrl) {
            finalAttachmentPath = pub.publicUrl;
          }
          console.log(`✓ RFQ attachment uploaded to Supabase Storage: uploads/${cloudPath}`);
        } else {
          console.warn("Supabase Storage RFQ upload warning:", cloudErr.message);
        }
      } catch (cloudEx) {
        console.warn("Could not upload RFQ attachment to Supabase Storage:", cloudEx.message);
      }
    }

    const result = await query(
      `INSERT INTO rfq_submissions (
        full_name, company_name, email, phone, industry,
        product_category, product_name, quantity, unit_of_measurement,
        technical_specifications, delivery_location, required_delivery_date,
        additional_comments, attachment_name, attachment_path, attachment_size, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'new')
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
        finalAttachmentName,
        finalAttachmentPath,
        finalAttachmentSize,
      ]
    );

    const rfqRecord = result.rows[0];

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
    } catch (emailErr) {
      console.warn("RFQ confirmation email failed:", emailErr.message);
    }

    return res.json({
      success: true,
      message: "Quotation request successfully submitted to our engineering desk.",
      rfqId: rfqRecord.id,
    });
  } catch (err) {
    console.error("RFQ API error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit quote request.", error: err.message });
  }
});

module.exports = router;
