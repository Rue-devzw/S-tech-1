"use client";

import { Eye, ImagePlus, PenLine, Save, Search } from "lucide-react";
import { useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

const categories = [
  "DEVICE_CARE",
  "LAPTOP_PERFORMANCE",
  "NETWORKING",
  "STARLINK",
  "CYBERSECURITY_BASICS",
  "WEBSITES",
  "BUSINESS_AUTOMATION",
  "AI_FOR_SMES"
] as const;

const services = [
  ["electronics-repairs", "Electronics repairs"],
  ["ict-support", "ICT support"],
  ["networking", "Networking"],
  ["starlink-installations", "Starlink installations"],
  ["web-development", "Web development"],
  ["software-ai-systems", "Software & AI systems"]
];

const samples = [
  { title: "How to keep your phone charging port healthy", category: "DEVICE_CARE", status: "Draft" },
  { title: "Laptop performance checks before buying upgrades", category: "LAPTOP_PERFORMANCE", status: "Published" },
  { title: "AI automation ideas for small businesses", category: "AI_FOR_SMES", status: "Published" }
];

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function list(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function BlogAdminEditor() {
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  async function save(form: HTMLFormElement) {
    setSaving(true);
    const data = new FormData(form);
    const response = await fetch("/api/admin/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(data.get("title")),
        slug: String(data.get("slug") ?? "") || undefined,
        excerpt: String(data.get("excerpt")),
        body: String(data.get("body")),
        category: String(data.get("category")),
        status: String(data.get("status")),
        seoTitle: String(data.get("seoTitle") ?? ""),
        seoDescription: String(data.get("seoDescription") ?? ""),
        featuredImageUrl: String(data.get("featuredImageUrl") ?? ""),
        featuredImageAlt: String(data.get("featuredImageAlt") ?? ""),
        relatedServiceSlug: String(data.get("relatedServiceSlug") ?? ""),
        tags: list(data.get("tags"))
      })
    });
    setSaving(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      flash(payload.error ?? "The article could not be saved.");
      return;
    }
    flash("Article saved with SEO metadata and publishing status.");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Knowledge centre</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Blog editor</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Publish practical guides for customers across device care, networking, Starlink, cybersecurity, websites, automation and AI for SMEs.
          </p>
        </div>
        <a href="/blog" className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
          <Eye size={16} />
          Public blog
        </a>
      </div>

      {notice ? <div className="mt-5 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">{notice}</div> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric icon={PenLine} label="Categories" value="8 topics" />
        <Metric icon={Search} label="SEO" value="Title and meta" />
        <Metric icon={ImagePlus} label="Media" value="Featured image" />
        <Metric icon={Save} label="Workflow" value="Drafts and publish" />
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Write article</h2>
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              save(event.currentTarget);
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label>Title<input name="title" required placeholder="How to improve laptop performance" /></label>
              <label>Slug<input name="slug" placeholder="improve-laptop-performance" /></label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label>Category<select name="category" defaultValue="LAPTOP_PERFORMANCE">{categories.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
              <label>Status<select name="status" defaultValue="DRAFT"><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
              <label>Related service<select name="relatedServiceSlug" defaultValue="electronics-repairs">{services.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></label>
            </div>
            <label className="mt-4">Excerpt<textarea name="excerpt" required rows={3} placeholder="Short summary for listings and SEO snippets." /></label>
            <label className="mt-4">Article body<textarea name="body" required rows={10} placeholder="Write practical, customer-friendly guidance..." /></label>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>SEO title<input name="seoTitle" maxLength={70} placeholder="Laptop performance guide | OmniTech" /></label>
              <label>SEO description<input name="seoDescription" maxLength={170} placeholder="Practical laptop performance checks before replacing your machine." /></label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label>Featured image URL<input name="featuredImageUrl" type="url" placeholder="https://..." /></label>
              <label>Image alt text<input name="featuredImageAlt" placeholder="Technician upgrading laptop SSD" /></label>
              <label>Tags<input name="tags" placeholder="laptops, SSD, performance" /></label>
            </div>
            <button disabled={saving} className="mt-5 w-full bg-copper px-5 py-3 text-sm font-semibold text-ink disabled:opacity-70">
              <LoadingButtonContent loading={saving} loadingLabel="Saving article">
                Save article
              </LoadingButtonContent>
            </button>
          </form>
        </section>

        <section className="grid gap-5">
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-xl font-semibold text-ink">Editorial coverage</h2>
            <div className="mt-4 grid gap-2">
              {categories.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg bg-cloud px-3 py-2 text-sm">
                  <span className="font-semibold text-ink">{label(item)}</span>
                  <span className="text-slate-500">Knowledge topic</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-xl font-semibold text-ink">Recent examples</h2>
            <div className="mt-4 grid gap-3">
              {samples.map((post) => (
                <article key={post.title} className="rounded-lg border border-line bg-cloud p-4">
                  <p className="text-xs font-semibold uppercase text-teal">{label(post.category)}</p>
                  <h3 className="mt-1 font-semibold text-ink">{post.title}</h3>
                  <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{post.status}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label: title, value }: { icon: typeof PenLine; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <Icon className="text-teal" size={22} />
      <p className="mt-4 text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </article>
  );
}
