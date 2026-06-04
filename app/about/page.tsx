import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CTASection, SectionHeader } from "@/components/public-sections";
import { audienceSegments } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "About OmniTech Solutions",
  description: "Learn about OmniTech Solutions, a Zimbabwe technology company for electronics repairs, connectivity, Starlink, software and AI automation.",
  path: "/about",
  keywords: ["technology company Zimbabwe", "OmniTech Harare", "ICT services Zimbabwe"]
});

export default function AboutPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])]) }} />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">About OmniTech</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight text-ink md:text-6xl">We repair. We connect. We build. We automate.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            OmniTech Solutions brings workshop repairs, field connectivity, infrastructure installations, software engineering and AI automation into one professional technology partner.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeader
          eyebrow="Mission"
          title="Make technology dependable, useful and easier to manage"
          body="Customers should not have to juggle separate providers for repairs, networking, Starlink, software and automation. OmniTech provides a single accountable team with structured communication and practical delivery."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {["Repair devices with clear diagnostics", "Connect sites with reliable infrastructure", "Build useful digital systems", "Automate repetitive work"].map((item) => (
            <div key={item} className="rounded-lg border border-line bg-white p-5 text-sm font-semibold text-ink">
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <SectionHeader eyebrow="Who we serve" title="Technology support for homes and organisations" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {audienceSegments.map((segment) => (
              <div key={segment} className="rounded-lg border border-line bg-cloud p-4 text-sm font-semibold text-slate-700">
                {segment}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </PageShell>
  );
}
