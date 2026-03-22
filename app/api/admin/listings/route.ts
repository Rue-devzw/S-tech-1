import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ensureAdminRequest } from "../_utils";
import {
  deleteListing,
  getListings,
  getListingById,
  upsertListing,
} from "@/lib/server/data-store";
import { type Listing } from "@/lib/mock-data";

const listingSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().nonnegative(),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  client: z.string().min(1),
  industry: z.string().min(1),
  deliveryTimeline: z.string().min(1),
  supportWindow: z.string().min(1),
  featured: z.boolean(),
  technologies: z.array(z.string().min(1)),
  features: z.array(z.string().min(1)),
  outcomes: z.array(z.string().min(1)),
  imageUrl: z.string().min(1),
  previewUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().nonnegative(),
  salesCount: z.number().int().nonnegative(),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner", "manager"]);
  if (response) {
    return response;
  }

  const listings = await getListings();
  return NextResponse.json({ listings });
}

export async function POST(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner", "manager"]);
  if (response) {
    return response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = listingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid listing payload." },
      { status: 400 }
    );
  }

  const incoming: Listing = parsed.data;
  await upsertListing(incoming);

  return NextResponse.json({ listing: incoming }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner", "manager"]);
  if (response) {
    return response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = listingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid listing payload." },
      { status: 400 }
    );
  }

  const incoming: Listing = parsed.data;
  const existing = await getListingById(incoming.id);

  if (!existing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  await upsertListing(incoming);

  return NextResponse.json({ listing: incoming });
}

export async function DELETE(request: NextRequest) {
  const { response } = await ensureAdminRequest(request, ["owner", "manager"]);
  if (response) {
    return response;
  }

  const payload = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Missing listing id." }, { status: 400 });
  }

  const deleted = await deleteListing(parsed.data.id);
  if (!deleted) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
