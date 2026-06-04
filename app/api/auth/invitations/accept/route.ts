import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { acceptInvitation } from "@/server/auth-workflows";
import { createSession } from "@/server/auth";
import { acceptInvitationSchema } from "@/server/validation";

export async function POST(request: Request) {
  try {
    const parsed = acceptInvitationSchema.parse(await request.json());
    const user = await acceptInvitation(parsed);
    await createSession(user);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Invalid invitation payload.", details: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not accept invitation." }, { status: 400 });
  }
}
