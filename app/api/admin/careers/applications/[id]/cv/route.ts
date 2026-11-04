import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-api-helper";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const { id } = params;

    const res = await query(
      `
      SELECT id, full_name, resume_storage_path, resume_original_name 
      FROM applications 
      WHERE id = $1;
    `,
      [id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    const app = res.rows[0];
    if (!app.resume_storage_path) {
      return NextResponse.json(
        { success: false, message: "No CV file is attached to this application." },
        { status: 404 }
      );
    }

    // Resolve storage file path
    const absolutePath = path.resolve(process.cwd(), app.resume_storage_path);

    // Prevent directory traversal
    const baseUploadDir = path.resolve(process.cwd(), "uploads");
    if (!absolutePath.startsWith(baseUploadDir)) {
      return NextResponse.json(
        { success: false, message: "Invalid file storage location." },
        { status: 403 }
      );
    }

    try {
      const fileBuffer = await fs.readFile(absolutePath);
      const ext = path.extname(absolutePath).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".pdf") contentType = "application/pdf";
      else if (ext === ".doc") contentType = "application/msword";
      else if (ext === ".docx") {
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      const originalName = app.resume_original_name || `resume-${app.id}${ext}`;
      const safeDownloadName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${safeDownloadName}"`,
          "Content-Length": String(fileBuffer.length),
        },
      });
    } catch (fsErr) {
      console.error("CV file read error:", fsErr);
      return NextResponse.json(
        { success: false, message: "Resume file could not be found on server storage." },
        { status: 404 }
      );
    }
  } catch (err: any) {
    console.error("Admin CV download error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to download CV document." },
      { status: 500 }
    );
  }
}
