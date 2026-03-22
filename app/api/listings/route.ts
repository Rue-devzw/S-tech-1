import { NextResponse } from "next/server";
import { getListings } from "@/lib/server/data-store";

export async function GET() {
  const listings = await getListings();
  return NextResponse.json({ listings });
}
