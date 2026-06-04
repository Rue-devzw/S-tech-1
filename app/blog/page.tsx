import type { Metadata } from "next";
import Link from "next/link";
import { ImageLoadingPlaceholder } from "@/components/brand-loader";
import { CTASection, SectionHeader } from "@/components/public-sections";
import { PageShell } from "@/components/site-shell";
import { blogPosts as fallbackPosts } from "@/lib/public-content";
import { absoluteUrl, breadcrumbJsonLd, makeMetadata } from "@/lib/seo";
import { listPublishedBlogPosts } from "@/server/services/blog-module";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Blog and Technology Knowledge Centre",
  description: "Practical OmniTech guides for device care, laptop performance, networking, Starlink, cybersecurity, websites, automation and AI for SMEs.",
  path: "/blog",
  keywords: ["technology blog Zimbabwe", "device care guides", "Starlink installation tips", "business automation guides"]
});

const fallbackImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
];

const topics = ["Device care", "Laptop performance", "Networking", "Starlink", "Cybersecurity basics", "Websites", "Business automation", "AI for SMEs"];

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function getPosts() {
  try {
    const posts = await listPublishedBlogPosts();
    if (posts.length) return posts;
  } catch {
    return [];
  }
  return [];
}

export default async function BlogPage() {
  const posts = await getPosts();
  const publicPosts = posts.length
    ? posts
    : fallbackPosts.map((post, index) => ({
        id: post.slug,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.excerpt,
        category: post.category.toUpperCase().replaceAll(" ", "_"),
        featuredImageUrl: fallbackImages[index % fallbackImages.length],
        featuredImageAlt: post.title,
        relatedServiceSlug: index === 0 ? "starlink-installations" : index === 1 ? "electronics-repairs" : "software-ai-systems",
        tags: [post.category, "OmniTech guide"],
        publishedAt: new Date()
      }));

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]),
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "OmniTech Solutions Blog",
              url: absoluteUrl("/blog"),
              blogPost: publicPosts.map((post) => ({
                "@type": "BlogPosting",
                headline: post.title,
                description: post.excerpt,
                url: absoluteUrl(`/blog/${post.slug}`)
              }))
            }
          ])
        }}
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeader
          eyebrow="Blog & knowledge centre"
          title="Practical technology guidance before you book work"
          body="Customer-friendly articles for repairs, connectivity, websites, cybersecurity, automation and AI adoption in growing organisations."
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span key={topic} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate-600">{topic}</span>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {publicPosts.map((post, index) => (
            <article key={post.slug} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
              <figure className="relative h-44 overflow-hidden bg-cloud">
                <ImageLoadingPlaceholder label="Loading image" className="absolute inset-0 rounded-none" />
                <img
                  src={post.featuredImageUrl ?? fallbackImages[index % fallbackImages.length]}
                  alt={post.featuredImageAlt ?? post.title}
                  className="relative h-full w-full object-cover"
                />
              </figure>
              <div className="p-5">
                <p className="text-sm font-semibold text-teal">{label(post.category)}</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-slate-600">{tag}</span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex text-sm font-semibold text-teal">Read guide</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
