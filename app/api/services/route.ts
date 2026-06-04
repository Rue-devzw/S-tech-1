import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
    include: { category: true }
  });
  return NextResponse.json({ services });
}
