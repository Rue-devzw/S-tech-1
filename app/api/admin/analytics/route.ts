import { NextRequest, NextResponse } from "next/server";
import { ensureAdminRequest } from "../_utils";
import { getAnalyticsOverview } from "@/lib/server/data-store";

export async function GET(request: NextRequest) {
  const { response } = await ensureAdminRequest(request);
  if (response) {
    return response;
  }

  const overview = await getAnalyticsOverview(30);
  return NextResponse.json({ overview });
}
