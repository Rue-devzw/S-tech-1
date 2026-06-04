import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { whatsappHref, type PublicService } from "@/lib/public-content";

const serviceTones = [
  "from-teal/16 via-white to-sky/12 text-teal",
  "from-sky/16 via-white to-violet/12 text-sky",
  "from-copper/16 via-white to-sun/16 text-copper",
  "from-violet/16 via-white to-teal/12 text-violet",
  "from-lime/16 via-white to-teal/12 text-lime",
  "from-sun/20 via-white to-copper/14 text-copper"
];

export function HeroSection({
  eyebrow,
  title,
  body,
  primaryHref = "/request-service",
  primaryLabel = "Request service",
  secondaryHref = whatsappHref,
  secondaryLabel = "Chat on WhatsApp"
}: {
  eyebrow: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <HeroVideoBackground />
      <div className="relative mx-auto grid min-h-[620px] max-w-[88rem] items-center gap-10 px-4 py-12 sm:px-6 md:min-h-[clamp(620px,calc(100svh-9rem),760px)] lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-teal-50 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-copper" />
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.02] text-white md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 md:text-xl">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-md bg-copper px-6 py-3.5 text-sm font-bold text-ink shadow-[0_18px_44px_rgba(242,183,5,0.24)]">
              {primaryLabel}
              <ArrowRight size={16} />
            </Link>
            <a href={secondaryHref} className="inline-flex items-center gap-2 rounded-md border border-white/28 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur hover:bg-white/16">
              <MessageCircle size={16} />
              {secondaryLabel}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {["Repair lab", "Field installs", "Business systems", "AI workflows"].map((item) => (
              <span key={item} className="rounded-full border border-white/25 bg-white/90 px-3 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur">{item}</span>
            ))}
          </div>
        </div>
        <div className="hidden rounded-lg border border-white/20 bg-white/12 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl md:block">
          <div className="rounded-lg bg-brand-band p-6 text-white shadow-lift ring-1 ring-white/12">
            <p className="text-sm font-semibold text-teal-50">OmniTech operating promise</p>
            <p className="mt-3 text-3xl font-bold leading-tight md:text-4xl">We repair. We connect. We build. We automate.</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Electronics repairs", "ICT and networking", "Starlink installations", "Software and AI systems"].map((item, index) => (
              <div key={item} className="status-burst min-h-24 rounded-lg border border-white/70 bg-white/90 p-4 text-sm font-bold text-ink shadow-sm">
                <span className={`mb-3 block h-1.5 w-10 rounded-full ${index === 0 ? "bg-copper" : index === 1 ? "bg-teal" : index === 2 ? "bg-sky" : "bg-violet"}`} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-teal">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-bold text-ink md:text-4xl">{title}</h2>
      {body ? <p className="mt-4 text-base leading-7 text-slate-600">{body}</p> : null}
    </div>
  );
}

export function ServiceCard({ service }: { service: PublicService }) {
  const Icon = service.icon;
  const tone = serviceTones[service.title.length % serviceTones.length];
  return (
    <article className={`omni-card rounded-lg bg-gradient-to-br ${tone} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-md bg-white/88 shadow-sm">
          <Icon size={22} />
        </span>
        <span className="rounded-full bg-white/78 px-3 py-1 text-xs font-semibold text-ink shadow-sm">{service.eyebrow}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-ink">{service.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{service.summary}</p>
      <Link href={`/${service.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal">
        Learn more
        <ArrowRight size={15} />
      </Link>
    </article>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
          <CheckCircle2 className="mt-0.5 shrink-0 text-teal" size={18} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CTASection() {
  return (
    <section className="bg-brand-band text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Ready when you are</p>
          <h2 className="mt-2 text-3xl font-bold">Need a repair, installation or digital system?</h2>
          <p className="mt-3 max-w-2xl text-white/86">Send the details now and OmniTech will help you move from issue to action.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/request-service" className="rounded-md bg-copper px-5 py-3 text-sm font-semibold text-ink">
            Request service
          </Link>
          <a href={whatsappHref} className="rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}

export function TestimonialGrid({ testimonials }: { testimonials: { quote: string; name: string; company: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {testimonials.map((item) => (
        <blockquote key={item.name} className="omni-card rounded-lg p-5">
          <p className="text-sm leading-6 text-slate-700">"{item.quote}"</p>
          <footer className="mt-4 text-sm font-semibold text-ink">
            {item.name}
            <span className="block font-normal text-slate-500">{item.company}</span>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
