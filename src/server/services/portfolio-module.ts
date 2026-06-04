import { Prisma } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { portfolioProjectSchema, testimonialSchema } from "@/server/validation";

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

export async function upsertPortfolioProject(input: unknown, actorId: string) {
  const parsed = portfolioProjectSchema.parse(input);
  const slug = parsed.slug ?? slugify(parsed.title);
  const publishedAt = parsed.published ? new Date() : null;
  const data = {
    title: parsed.title,
    slug,
    category: parsed.category,
    clientName: clean(parsed.clientName),
    clientSector: parsed.clientSector,
    summary: parsed.summary,
    challenge: parsed.challenge,
    solution: parsed.solution,
    toolsUsed: parsed.toolsUsed,
    outcome: parsed.outcome,
    description: clean(parsed.description),
    imageUrl: clean(parsed.imageUrl),
    beforeImageUrls: parsed.beforeImageUrls,
    afterImageUrls: parsed.afterImageUrls,
    visibility: parsed.visibility,
    showClientName: parsed.showClientName,
    showExactLocation: parsed.showExactLocation,
    featured: parsed.featured,
    sortOrder: parsed.sortOrder,
    published: parsed.published,
    publishedAt
  } satisfies Prisma.PortfolioProjectUncheckedCreateInput;

  const project = await prisma.portfolioProject.upsert({
    where: { slug },
    update: data,
    create: data
  });

  await audit("PORTFOLIO_PROJECT_UPSERTED", "PortfolioProject", project.id, actorId, {
    slug: project.slug,
    published: project.published,
    visibility: project.visibility
  });
  return project;
}

export async function listAdminPortfolioProjects() {
  return prisma.portfolioProject.findMany({
    where: { deletedAt: null },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
    include: { testimonials: true }
  });
}

export async function listPublishedPortfolioProjects() {
  return prisma.portfolioProject.findMany({
    where: { deletedAt: null, published: true, visibility: { not: "PRIVATE" } },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
    include: {
      testimonials: {
        where: { deletedAt: null, published: true, consentToPublish: true },
        orderBy: { publishedAt: "desc" },
        take: 2
      }
    }
  });
}

export async function upsertTestimonial(input: unknown, actorId: string) {
  const parsed = testimonialSchema.parse(input);
  const testimonial = await prisma.testimonial.create({
    data: {
      customerId: clean(parsed.customerId),
      projectId: clean(parsed.projectId),
      name: parsed.name,
      company: clean(parsed.company),
      clientSector: clean(parsed.clientSector),
      quote: parsed.quote,
      rating: parsed.rating,
      consentToPublish: parsed.consentToPublish,
      privacyLabel: clean(parsed.privacyLabel),
      published: parsed.published,
      publishedAt: parsed.published ? new Date() : null
    }
  });

  await audit("TESTIMONIAL_CREATED", "Testimonial", testimonial.id, actorId, {
    published: testimonial.published,
    consentToPublish: testimonial.consentToPublish
  });
  return testimonial;
}

export async function listAdminTestimonials() {
  return prisma.testimonial.findMany({
    where: { deletedAt: null },
    orderBy: [{ published: "desc" }, { createdAt: "desc" }],
    include: { project: true, customer: true }
  });
}

export async function listPublishedTestimonials() {
  return prisma.testimonial.findMany({
    where: { deletedAt: null, published: true, consentToPublish: true },
    orderBy: { publishedAt: "desc" },
    take: 12,
    include: { project: true }
  });
}
