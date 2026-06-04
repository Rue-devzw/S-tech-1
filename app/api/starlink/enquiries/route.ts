import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { currentUser } from "@/server/auth";
import { createStarlinkEnquiry, starlinkDisclaimer } from "@/server/services/starlink-module";

export async function GET() {
  return NextResponse.json({ disclaimer: starlinkDisclaimer });
}

export async function POST(request: Request) {
  const actor = await currentUser();
  try {
    const enquiry = await createStarlinkEnquiry(await request.json(), actor?.id);
    return NextResponse.json({ enquiry, disclaimer: starlinkDisclaimer }, { status: 201 });
  } catch (error) {
    return apiError(error, "Could not create Starlink-related enquiry.");
  }
}
