import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageLoadingPlaceholder } from "@/components/brand-loader";
import { CTASection } from "@/components/public-sections";
import { PageShell } from "@/components/site-shell";
import { publicServices } from "@/lib/public-content";
import { absoluteUrl, breadcrumbJsonLd, makeMetadata } from "@/lib/seo";
import { getPublishedBlogPost } from "@/server/services/blog-module";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug).catch(() => null);
  if (!post) return { title: "Knowledge Centre | OmniTech Solutions" };
  return makeMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImageUrl ?? undefined,
    type: "article",
    keywords: [post.category, ...post.tags]
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug).catch(() => null);
  if (!post) notFound();

  const related = publicServices.find((service) => service.slug === post.relatedServiceSlug) ?? publicServices[0];

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]),
            {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              image: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
              datePublished: post.publishedAt?.toISOString(),
              dateModified: post.updatedAt?.toISOString(),
              author: { "@type": "Organization", name: "OmniTech Solutions" },
              publisher: {
                "@type": "Organization",
                name: "OmniTech Solutions",
                logo: {
                  "@type": "ImageObject",
                  url: absoluteUrl("/brand/omnitech-logo.png")
                }
              },
              mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`)
            }
          ])
        }}
      />
      <article className="mx-auto max-w-4xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal">{label(post.category)}</p>
        <h1 className="mt-3 text-4xl font-bold text-ink">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{post.excerpt}</p>
        {post.featuredImageUrl ? (
          <figure className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-cloud">
            <ImageLoadingPlaceholder label="Loading image" className="absolute inset-0 rounded-none" />
            <img src={post.featuredImageUrl} alt={post.featuredImageAlt ?? post.title} className="relative h-full w-full object-cover" />
          </figure>
        ) : null}
        <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{post.body}</div>
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-cloud px-3 py-1 text-xs font-semibold text-slate-600">{tag}</span>
          ))}
        </div>
        <aside className="mt-10 rounded-lg border border-line bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-copper">Related service</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">{related.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{related.summary}</p>
          <Link href={`/${related.slug}`} className="mt-5 inline-flex bg-ink px-5 py-3 text-sm font-semibold text-white">Explore service</Link>
        </aside>
      </article>
      <CTASection />
    </PageShell>
  );
}
