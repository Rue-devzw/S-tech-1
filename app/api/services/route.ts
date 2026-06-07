import { NextResponse } from "next/server";
import { publicServices } from "@/lib/public-content";
import { prisma } from "@/server/db";

function fallbackServices() {
  return publicServices.map((service, index) => ({
    id: service.slug,
    slug: service.slug,
    name: service.title,
    shortDescription: service.summary,
    description: service.description,
    isActive: true,
    category: {
      id: service.eyebrow.toLowerCase().replace(/\s+/g, "-"),
      name: service.eyebrow,
      sortOrder: index
    }
  }));
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
      include: { category: true }
    });
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ services: fallbackServices(), source: "fallback" });
  }
}
