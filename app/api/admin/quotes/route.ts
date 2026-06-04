import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Quotation API pending expanded schema service implementation." }, { status: 503 });
}
