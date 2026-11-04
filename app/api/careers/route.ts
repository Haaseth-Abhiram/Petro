import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { query } from "@/lib/db";
import { sendCareerApplicationEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const g = (k: string) => String(form.get(k) || "").trim();

    const fullName = g("fullName");
    const email = g("email");
    const phone = g("phone");
    const role = g("role");
    const experience = g("experience");
    const link = g("link");
    const message = g("message");

    // Validation
    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { success: false, message: "Full name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        { success: false, message: "A valid contact phone number is required." },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Please select a role of interest." },
        { status: 400 }
      );
    }

    if (!experience) {
      return NextResponse.json(
        { success: false, message: "Please choose your experience level." },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { success: false, message: "Please provide a short cover note or introduction (minimum 10 characters)." },
        { status: 400 }
      );
    }

    if (link) {
      try {
        const parsed = new URL(link);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("Invalid protocol");
        }
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Please enter a valid URL (starting with http:// or https://) for your CV or LinkedIn link." },
          { status: 400 }
        );
      }
    }

    // Role verification against database
    let matchedJobId: string | null = null;
    let matchedJobTitle = role;

    if (role !== "General Application") {
      const jobCheck = await query(
        `SELECT id, role, title, status FROM jobs WHERE (role = $1 OR title = $1) LIMIT 1;`,
        [role]
      );

      if (jobCheck.rowCount === 0) {
        // If not found by exact role/title, try slug or matching
        const jobCheckLoose = await query(
          `SELECT id, role, title, status FROM jobs WHERE role ILIKE $1 OR title ILIKE $1 LIMIT 1;`,
          [`%${role}%`]
        );
        if (jobCheckLoose.rowCount === 0) {
          return NextResponse.json(
            { success: false, message: "The selected position was not found. Please select an available role or choose General Application." },
            { status: 400 }
          );
        } else {
          const j = jobCheckLoose.rows[0];
          if (j.status !== "published") {
            return NextResponse.json(
              { success: false, message: `The position "${j.title}" is currently closed or no longer accepting applications. Please select an active vacancy.` },
              { status: 400 }
            );
          }
          matchedJobId = j.id;
          matchedJobTitle = j.title;
        }
      } else {
        const j = jobCheck.rows[0];
        if (j.status !== "published") {
          return NextResponse.json(
            { success: false, message: `The position "${j.title}" is currently closed or no longer accepting applications. Please select an active vacancy.` },
            { status: 400 }
          );
        }
        matchedJobId = j.id;
        matchedJobTitle = j.title;
      }
    }

    // CV file validation and storage
    const file = form.get("cv");
    if (!file || typeof file === "string" || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "Uploading your CV (PDF, DOC, or DOCX) is required." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS[ext]) {
      return NextResponse.json(
        { success: false, message: "Please upload your resume in PDF, DOC, or DOCX format." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "The CV file size exceeds the 5 MB limit. Please upload a smaller document." },
        { status: 400 }
      );
    }

    // Save CV to private storage: uploads/careers/
    const uploadDir = path.join(process.cwd(), "uploads", "careers");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFilename = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const storagePath = path.join(uploadDir, safeFilename);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(storagePath, fileBuffer);

    // Relative storage reference
    const relativePath = `uploads/careers/${safeFilename}`;

    // Generate unique application reference
    const currentYear = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const reference = `APP-${currentYear}-${randomCode}`;

    // Insert Application into database
    const appRes = await query(
      `
      INSERT INTO applications (
        application_reference,
        job_id,
        job_title,
        full_name,
        phone,
        email,
        role_of_interest,
        experience,
        linkedin_url,
        resume_storage_path,
        resume_original_name,
        resume_file_size,
        cover_note,
        status,
        submitted_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'New', NOW(), NOW())
      RETURNING id, application_reference, created_at;
    `,
      [
        reference,
        matchedJobId,
        matchedJobTitle,
        fullName,
        phone,
        email,
        role,
        experience,
        link || null,
        relativePath,
        file.name,
        file.size,
        message,
      ]
    );

    const newAppId = appRes.rows[0].id;

    // Record initial status history
    await query(
      `
      INSERT INTO application_status_history (
        application_id,
        previous_status,
        new_status,
        changed_by,
        note,
        created_at
      )
      VALUES ($1, NULL, 'New', 'Candidate Submission', 'Application submitted via public careers portal', NOW());
    `,
      [newAppId]
    );

    // Also insert into contact_messages for unified inbox visibility if needed
    try {
      await query(
        `
        INSERT INTO contact_messages (
          full_name,
          company_name,
          email,
          phone,
          subject,
          message,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'new');
      `,
        [
          fullName,
          "Candidate Application",
          email,
          phone,
          `Career Application [${reference}] - ${role}`,
          `Reference: ${reference}\nPosition: ${role}\nExperience: ${experience}\nCV: ${file.name} (${Math.round(file.size / 1024)} KB)\nLinkedIn/Link: ${link || "None"}\n\nCover Note:\n${message}`,
        ]
      );
    } catch (cmErr) {
      console.warn("Could not write shadow contact message:", cmErr);
    }

    // Send email acknowledgement
    try {
      await sendCareerApplicationEmail({
        id: newAppId,
        applicationReference: reference,
        fullName,
        email,
        role,
        experience,
      });
    } catch (mailErr: any) {
      console.warn("Could not deliver candidate acknowledgement email:", mailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      reference,
    });
  } catch (err: any) {
    console.error("Career application submission error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred while saving your application. Please try again." },
      { status: 500 }
    );
  }
}
