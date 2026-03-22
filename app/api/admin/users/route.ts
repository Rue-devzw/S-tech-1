import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminRequest } from "../_utils";
import {
  createAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "@/lib/server/data-store";

const createUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9._-]+$/i,
      "Use letters, numbers, dots, dashes, or underscores."
    ),
  displayName: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["owner", "manager", "support"]),
  password: z.string().min(8),
});

const updateUserSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["owner", "manager", "support"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function GET(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner"]);
  if (response) {
    return response;
  }

  const users = await listAdminUsers();
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const auth = await ensureAdminRequest(request, ["owner"]);
  if (auth.response) {
    return auth.response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid team member payload." },
      { status: 400 }
    );
  }

  try {
    const user = await createAdminUser(parsed.data, auth.session.user.username);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create user.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await ensureAdminRequest(request, ["owner"]);
  if (auth.response) {
    return auth.response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = updateUserSchema.safeParse(payload);

  if (!parsed.success || (!parsed.data.role && !parsed.data.status)) {
    return NextResponse.json(
      { error: "Invalid team update payload." },
      { status: 400 }
    );
  }

  if (
    parsed.data.id === auth.session.user.id &&
    (parsed.data.status === "inactive" || parsed.data.role !== undefined)
  ) {
    return NextResponse.json(
      { error: "You cannot change your own active role from this screen." },
      { status: 400 }
    );
  }

  const user = await updateAdminUser(
    parsed.data.id,
    {
      role: parsed.data.role,
      status: parsed.data.status,
    },
    auth.session.user.username
  );

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user });
}
