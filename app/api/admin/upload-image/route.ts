import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api-helper";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".gif",
]);

// 10 MB maximum upload size
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const { admin, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image exceeds 10 MB size limit." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name || "").toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid image format. Allowed formats: PNG, JPG, JPEG, WEBP, SVG, GIF.",
        },
        { status: 400 }
      );
    }

    const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : ".jpg";
    const baseName = path
      .basename(file.name || "upload", ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40)
      .toLowerCase();
    const uniqueName = `${baseName || "img"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "images");
    await fs.mkdir(uploadDir, { recursive: true });

    const targetPath = path.join(uploadDir, uniqueName);
    const bytes = await file.arrayBuffer();
    await fs.writeFile(targetPath, Buffer.from(bytes));

    const publicUrl = `/uploads/images/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
      size: file.size,
      mimeType: file.type || "image/jpeg",
    });
  } catch (err: any) {
    console.error("Image upload failed:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to upload image." },
      { status: 500 }
    );
  }
}
