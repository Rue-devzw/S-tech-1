import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { currentUser } from "@/server/auth";

export const runtime = "nodejs";

const maxUploadBytes = 8 * 1024 * 1024;
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf"
]);

function safeName(name: string) {
  return name.replace(/[^\w .()_-]/g, "_").slice(0, 120) || "upload";
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob storage is not configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = safeName(String(formData.get("folder") ?? "uploads")).replace(/\s+/g, "-").toLowerCase();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file field is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Only images and PDF files are allowed." }, { status: 400 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ error: "Files must be 8 MB or smaller." }, { status: 400 });
  }

  const filename = safeName(file.name);
  const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${filename}`;
  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type
  });

  return NextResponse.json({
    file: {
      filename,
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      size: file.size
    }
  });
}
