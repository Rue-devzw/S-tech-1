import { Prisma } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { blogPostSchema } from "@/server/validation";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function clean(value?: string | null) {
  return value?.trim() || undefined;
}

export async function upsertBlogPost(input: unknown, actorId: string) {
  const parsed = blogPostSchema.parse(input);
  const slug = parsed.slug ?? slugify(parsed.title);
  const data = {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt,
    body: parsed.body,
    category: parsed.category,
    status: parsed.status,
    seoTitle: clean(parsed.seoTitle),
    seoDescription: clean(parsed.seoDescription),
    featuredImageUrl: clean(parsed.featuredImageUrl),
    featuredImageAlt: clean(parsed.featuredImageAlt),
    relatedServiceSlug: clean(parsed.relatedServiceSlug),
    tags: parsed.tags,
    publishedAt: parsed.status === "PUBLISHED" ? new Date() : null
  } satisfies Prisma.BlogPostUncheckedCreateInput;

  const post = await prisma.blogPost.upsert({
    where: { slug },
    update: data,
    create: data
  });

  await audit("BLOG_POST_UPSERTED", "BlogPost", post.id, actorId, {
    slug: post.slug,
    category: post.category,
    status: post.status
  });
  return post;
}

export async function listAdminBlogPosts() {
  return prisma.blogPost.findMany({
    where: { deletedAt: null },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }]
  });
}

export async function listPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
  });
}

export async function getPublishedBlogPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, deletedAt: null, status: "PUBLISHED" }
  });
}
