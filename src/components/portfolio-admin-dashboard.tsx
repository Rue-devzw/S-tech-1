"use client";

import { Eye, ImagePlus, MessageSquareQuote, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { LoadingButtonContent } from "@/components/brand-loader";

const categories = [
  "REPAIR",
  "WEBSITE",
  "MOBILE_APP",
  "NETWORK_INSTALLATION",
  "STARLINK_INSTALLATION",
  "AI_SYSTEM",
  "SOFTWARE_SYSTEM",
  "ICT_SUPPORT"
] as const;

const projectExamples = [
  { title: "Phone repair recovery", category: "REPAIR", sector: "Home user", status: "Draft" },
  { title: "School Wi-Fi refresh", category: "NETWORK_INSTALLATION", sector: "Education", status: "Published" },
  { title: "SME workflow portal", category: "SOFTWARE_SYSTEM", sector: "SME", status: "Featured" }
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

export function PortfolioAdminDashboard() {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 4500);
  }

  async function post(path: string, body: Record<string, unknown>, message: string) {
    setBusy(path);
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setBusy("");
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      flash(payload.error ?? "The portfolio action could not be completed.");
      return;
    }
    flash(message);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Portfolio CMS</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Projects and testimonials</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Publish proof of work across repairs, websites, apps, networking, Starlink services and AI systems while protecting client privacy.
          </p>
        </div>
        <a href="/portfolio" className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
          <Eye size={16} />
          Public view
        </a>
      </div>

      {notice ? <div className="mt-5 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm font-semibold text-teal">{notice}</div> : null}

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <Metric icon={ImagePlus} label="Project types" value="8 categories" />
        <Metric icon={ShieldCheck} label="Privacy" value="Public or anonymized" />
        <Metric icon={MessageSquareQuote} label="Testimonials" value="Consent gated" />
        <Metric icon={Save} label="Publishing" value="Audit logged" />
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Publish project</h2>
          <form
            className="mt-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              post(
                "/api/admin/portfolio/projects",
                {
                  title: String(form.get("title")),
                  category: String(form.get("category")),
                  clientName: String(form.get("clientName") ?? ""),
                  clientSector: String(form.get("clientSector")),
                  summary: String(form.get("summary")),
                  challenge: String(form.get("challenge")),
                  solution: String(form.get("solution")),
                  toolsUsed: list(form.get("toolsUsed")),
                  outcome: String(form.get("outcome")),
                  imageUrl: String(form.get("imageUrl") ?? ""),
                  beforeImageUrls: list(form.get("beforeImageUrls")),
                  afterImageUrls: list(form.get("afterImageUrls")),
                  visibility: String(form.get("visibility")),
                  showClientName: form.get("showClientName") === "on",
                  featured: form.get("featured") === "on",
                  published: form.get("published") === "on",
                  sortOrder: Number(form.get("sortOrder") ?? 0)
                },
                "Portfolio project saved with privacy controls."
              );
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label>Project title<input name="title" required placeholder="School network installation" /></label>
              <label>Category<select name="category" defaultValue="NETWORK_INSTALLATION">{categories.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select></label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label>Client name<input name="clientName" placeholder="Optional" /></label>
              <label>Client sector<input name="clientSector" required placeholder="Education, lodge, SME..." /></label>
              <label>Privacy<select name="visibility" defaultValue="ANONYMIZED"><option value="PUBLIC">Public</option><option value="ANONYMIZED">Anonymized</option><option value="PRIVATE">Private</option></select></label>
            </div>
            <label className="mt-4">Summary<textarea name="summary" required rows={3} placeholder="Short public-facing project summary." /></label>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>Challenge<textarea name="challenge" required rows={4} placeholder="What problem did the client need solved?" /></label>
              <label>Solution<textarea name="solution" required rows={4} placeholder="What did OmniTech deliver?" /></label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label>Tools used<input name="toolsUsed" placeholder="Ubiquiti, Starlink, Next.js, Prisma" /></label>
              <label>Outcome<input name="outcome" required placeholder="Stable Wi-Fi, faster intake, repaired device..." /></label>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label>Hero image URL<input name="imageUrl" type="url" placeholder="https://..." /></label>
              <label>Before image URLs<input name="beforeImageUrls" placeholder="Comma-separated URLs" /></label>
              <label>After image URLs<input name="afterImageUrls" placeholder="Comma-separated URLs" /></label>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <label className="flex items-center gap-2"><input name="showClientName" type="checkbox" />Show client</label>
              <label className="flex items-center gap-2"><input name="featured" type="checkbox" defaultChecked />Featured</label>
              <label className="flex items-center gap-2"><input name="published" type="checkbox" defaultChecked />Published</label>
              <label>Sort order<input name="sortOrder" type="number" min="0" defaultValue="10" /></label>
            </div>
            <button disabled={busy === "/api/admin/portfolio/projects"} className="mt-5 w-full bg-copper px-5 py-3 text-sm font-semibold text-ink disabled:opacity-70">
              <LoadingButtonContent loading={busy === "/api/admin/portfolio/projects"} loadingLabel="Saving project">
                Save project
              </LoadingButtonContent>
            </button>
          </form>
        </section>

        <section className="grid gap-5">
          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-xl font-semibold text-ink">Capture testimonial</h2>
            <form
              className="mt-4"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                post(
                  "/api/admin/portfolio/testimonials",
                  {
                    name: String(form.get("name")),
                    company: String(form.get("company") ?? ""),
                    clientSector: String(form.get("clientSector") ?? ""),
                    quote: String(form.get("quote")),
                    rating: Number(form.get("rating") ?? 5),
                    consentToPublish: form.get("consentToPublish") === "on",
                    privacyLabel: String(form.get("privacyLabel") ?? ""),
                    published: form.get("published") === "on"
                  },
                  "Testimonial saved with publish consent."
                );
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label>Name<input name="name" required placeholder="Customer name" /></label>
                <label>Company<input name="company" placeholder="Optional" /></label>
              </div>
              <label className="mt-4">Sector<input name="clientSector" placeholder="Home user, school, clinic..." /></label>
              <label className="mt-4">Privacy label<input name="privacyLabel" placeholder="Operations Lead, School Administrator..." /></label>
              <label className="mt-4">Quote<textarea name="quote" required rows={4} placeholder="What did the customer say?" /></label>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label>Rating<input name="rating" type="number" min="1" max="5" defaultValue="5" /></label>
                <label className="flex items-center gap-2"><input name="consentToPublish" type="checkbox" defaultChecked />Consent</label>
                <label className="flex items-center gap-2"><input name="published" type="checkbox" defaultChecked />Published</label>
              </div>
              <button disabled={busy === "/api/admin/portfolio/testimonials"} className="mt-5 w-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
                <LoadingButtonContent loading={busy === "/api/admin/portfolio/testimonials"} loadingLabel="Saving testimonial">
                  Save testimonial
                </LoadingButtonContent>
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-xl font-semibold text-ink">Recent project examples</h2>
            <div className="mt-4 grid gap-3">
              {projectExamples.map((project) => (
                <article key={project.title} className="rounded-lg border border-line bg-cloud p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-teal">{label(project.category)}</p>
                      <h3 className="mt-1 font-semibold text-ink">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{project.sector}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{project.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label: title, value }: { icon: typeof ImagePlus; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <Icon className="text-teal" size={22} />
      <p className="mt-4 text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </article>
  );
}
