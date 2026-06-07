import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { publicServices } from "@/lib/public-content";
import { hasDatabaseUrl } from "@/server/env";
import { listPublishedBlogPosts } from "@/server/services/blog-module";
import { listPublishedPortfolioProjects } from "@/server/services/portfolio-module";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/portfolio", priority: 0.75, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/terms-of-service", priority: 0.35, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.35, changeFrequency: "yearly" as const },
  { path: "/impressum", priority: 0.35, changeFrequency: "yearly" as const },
  { path: "/request-service", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/track-repair", priority: 0.55, changeFrequency: "monthly" as const },
  ...publicServices.map((service) => ({
    path: `/${service.slug}`,
    priority: 0.9,
    changeFrequency: "monthly" as const
  }))
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));

  if (!hasDatabaseUrl()) return routes;

  try {
    const posts = await listPublishedBlogPosts();
    routes.push(
      ...posts.map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: post.updatedAt ?? post.publishedAt ?? now,
        changeFrequency: "monthly" as const,
        priority: 0.72
      }))
    );
  } catch {
    // Keep sitemap generation resilient in environments without a database.
  }

  try {
    const projects = await listPublishedPortfolioProjects();
    if (projects.length) {
      routes.push({
        url: absoluteUrl("/portfolio"),
        lastModified: projects[0]?.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.78
      });
    }
  } catch {
    // Keep sitemap generation resilient in environments without a database.
  }

  return routes;
}
