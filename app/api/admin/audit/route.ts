import { NextRequest, NextResponse } from "next/server";
import { ensureAdminRequest } from "../_utils";
import { getAuditEvents } from "@/lib/server/data-store";

export async function GET(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner"]);
  if (response) {
    return response;
  }

  const events = await getAuditEvents(25);
  return NextResponse.json({ events });
}
