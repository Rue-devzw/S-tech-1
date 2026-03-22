import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminRequest } from "../_utils";
import { getInquiries, updateInquiryStatus } from "@/lib/server/data-store";

const updateInquirySchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "responded", "closed"]),
});

export async function GET(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, [
    "owner",
    "manager",
    "support",
  ]);
  if (response) {
    return response;
  }

  const inquiries = await getInquiries();
  return NextResponse.json({ inquiries });
}

export async function PATCH(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, [
    "owner",
    "manager",
    "support",
  ]);
  if (response) {
    return response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateInquirySchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid inquiry update payload." },
      { status: 400 }
    );
  }

  const inquiry = await updateInquiryStatus(parsed.data.id, parsed.data.status);
  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  }
  return NextResponse.json({ inquiry });
}
