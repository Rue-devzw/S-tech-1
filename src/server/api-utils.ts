import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown, fallback = "Request failed.") {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed.", details: error.flatten() }, { status: 400 });
  }
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}

export function searchParams(request: Request) {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
}

export function pagination(input: { page?: string | number; pageSize?: string | number }) {
  const page = Math.max(1, Number(input.page ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(input.pageSize ?? 20) || 20));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export function paginated<T>(items: T[], total: number, page: number, pageSize: number) {
  return { data: items, meta: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) } };
}
