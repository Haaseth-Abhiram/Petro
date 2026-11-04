import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { query } from "@/lib/db";
import { sendEnquiryStatusUpdateEmail } from "@/lib/email-service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX = 5 * 1024 * 1024;
const OK = { ".pdf": "application/pdf", ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" } as Record<string, string>;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const g = (k: string) => String(form.get(k) || "").trim();
    const fullName = g("fullName"), email = g("email"), phone = g("phone"), role = g("role"), experience = g("experience"), link = g("link"), message = g("message");
    if (!fullName || !/^\S+@\S+\.\S+$/.test(email) || !message) {
      return NextResponse.json({ success: false, message: "Name, a valid email and a short note are required." }, { status: 400 });
    }

    let cvLine = "CV: not uploaded";
    const file = form.get("cv");
    if (file && typeof file !== "string" && file.size > 0) {
      const ext = path.extname(file.name).toLowerCase();
      if (!OK[ext]) return NextResponse.json({ success: false, message: "Please upload your CV as a PDF, DOC or DOCX file." }, { status: 400 });
      if (file.size > MAX) return NextResponse.json({ success: false, message: "The CV file is larger than 5 MB." }, { status: 400 });
      const dir = path.join(process.cwd(), "uploads", "careers");
      await fs.mkdir(dir, { recursive: true });
      const stored = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
      await fs.writeFile(path.join(dir, stored), Buffer.from(await file.arrayBuffer()));
      cvLine = `CV: ${file.name} (${Math.round(file.size / 1024)} KB) — saved as uploads/careers/${stored}`;
    }

    const subject = `Career Application - ${role || "General application"}`;
    const body = `Role: ${role}\nExperience: ${experience}\nLink: ${link || "not provided"}\n${cvLine}\n\n${message}`;
    const res = await query(
      `INSERT INTO contact_messages (full_name, company_name, email, phone, subject, message, status) VALUES ($1,$2,$3,$4,$5,$6,'new') RETURNING id;`,
      [fullName, "Career applicant", email, phone, subject, body]
    );
    try {
      await sendEnquiryStatusUpdateEmail({ id: res.rows[0].id, fullName, email, companyName: "Career applicant", subject, status: "new", isNew: true });
    } catch (e: any) {
      console.warn("Career confirmation email failed:", e.message);
    }
    return NextResponse.json({ success: true, message: "Application received." });
  } catch (err: any) {
    console.error("Careers API error:", err);
    return NextResponse.json({ success: false, message: "Failed to submit application." }, { status: 500 });
  }
}
