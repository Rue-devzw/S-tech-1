import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { currentUser } from "@/server/auth";
import { createStarlinkSupportTicket } from "@/server/services/starlink-module";

export async function POST(request: Request) {
  const actor = await currentUser();
  try {
    const ticket = await createStarlinkSupportTicket(await request.json(), actor?.id);
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not open Starlink-related support ticket.");
  }
}
