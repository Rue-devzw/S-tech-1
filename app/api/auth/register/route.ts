import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSession, hashPassword } from "@/server/auth";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { rateLimit } from "@/server/security";
import { customerRegisterSchema } from "@/server/validation";

export async function POST(request: Request) {
  const limited = rateLimit(request, "auth:customer-register", 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many account creation attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  try {
    const parsed = customerRegisterSchema.parse(await request.json());
    const existing = await prisma.user.findUnique({ where: { email: parsed.email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email.toLowerCase(),
        phone: parsed.phone,
        passwordHash: await hashPassword(parsed.password),
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        customer: {
          create: {
            name: parsed.name,
            email: parsed.email.toLowerCase(),
            phone: parsed.phone,
            organization: parsed.organization || undefined,
            type: parsed.organization ? "SME" : "HOME"
          }
        }
      }
    });

    const role = await prisma.role.upsert({
      where: { name: "CUSTOMER" },
      update: {},
      create: { name: "CUSTOMER", label: "Customer", description: "Customer portal access." }
    });
    await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
    await createSession(user);
    await audit("CUSTOMER_REGISTERED", "User", user.id, user.id);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Please check your account details.", details: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
