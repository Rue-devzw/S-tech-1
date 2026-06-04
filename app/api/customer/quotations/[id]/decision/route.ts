import { NextResponse } from "next/server";
import { apiError } from "@/server/api-utils";
import { currentUser } from "@/server/auth";
import { decideQuotation } from "@/server/services/job-workflow";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await currentUser();
  if (!actor) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [{ id }, body] = await Promise.all([params, request.json()]);
    const quotation = await decideQuotation(body, actor.id, id);
    return NextResponse.json({ quotation });
  } catch (error) {
    return apiError(error, "Could not record quotation decision.");
  }
}
