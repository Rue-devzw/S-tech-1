import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { SectionHeader } from "@/components/public-sections";
import { ContactForm } from "@/components/public-forms";
import { brand } from "@/lib/constants";
import { whatsappChannelHref, whatsappHref } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Contact OmniTech Solutions",
  description: "Contact OmniTech Solutions on WhatsApp or phone for electronics repairs, ICT support, networking, Starlink installations, web development and AI systems.",
  path: "/contact",
  keywords: ["contact OmniTech", "OmniTech WhatsApp", "technology support Harare"]
});

export default function ContactPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])]) }} />
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Contact" title="Talk to OmniTech" body="Send a message, request a service or start a WhatsApp conversation. Share the device, site, issue, deadline and location where possible." />
          <div className="mt-6 grid gap-3">
            <a href={whatsappHref} className="inline-flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-semibold text-ink">
              <MessageCircle className="text-teal" size={20} />
              Chat on WhatsApp
            </a>
            <a href={whatsappChannelHref} className="inline-flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-semibold text-ink">
              <MessageCircle className="text-teal" size={20} />
              Follow our WhatsApp channel
            </a>
            <a href={`tel:${brand.phone.replaceAll(" ", "")}`} className="inline-flex items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm font-semibold text-ink">
              <Phone className="text-teal" size={20} />
              {brand.phone}
            </a>
          </div>
        </div>
        <ContactForm />
      </section>
    </PageShell>
  );
}
