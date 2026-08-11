import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { brand } from "@/lib/constants";
import { whatsappHref } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Terms of Service",
  description: "Terms of Service for OmniTech Solutions repairs, ICT support, installations, software, AI automation and customer portal services.",
  path: "/terms-of-service",
  keywords: ["OmniTech terms", "technology services terms", "repair service terms Zimbabwe"]
});

const terms = [
  {
    title: "1. About These Terms",
    body: [
      `These Terms of Service govern your use of ${brand.name}'s website, customer portal, service request forms, repair tracking tools, quotations, invoices, communications and technology services.`,
      "By requesting a service, creating an account, accepting a quotation, making a payment or using the platform, you agree to these terms. If a signed proposal, contract, warranty note or invoice has different terms, that document applies to the specific work it covers."
    ]
  },
  {
    title: "2. Services Covered",
    body: [
      `${brand.name} provides electronics repairs, phone and computer repairs, ICT support, networking, Starlink installation support, web development, software engineering, AI automation, field-service visits, reporting and related technology services.`,
      "Some services depend on site conditions, supplier availability, third-party platforms, customer approvals, access permissions, device condition and network or power availability."
    ]
  },
  {
    title: "3. Service Requests, Diagnostics And Quotes",
    body: [
      "A service request is an enquiry until accepted by OmniTech. We may ask for photos, model numbers, location details, access notes, symptoms, urgency and proof of ownership or authorisation.",
      "Diagnostics may be required before a quote can be issued. Diagnostic findings are based on the condition of the device, system or site at the time of inspection.",
      "Quotes are valid only for the period stated on the quote. If parts, labour, supplier pricing, exchange rates or site requirements change, we may revise the quote before continuing."
    ]
  },
  {
    title: "4. Customer Responsibilities",
    body: [
      "You must provide accurate information, lawful access to devices, premises, systems and accounts, and timely approvals where required.",
      "You are responsible for backing up data before repairs, upgrades, diagnostics, software work or device handover. Unless expressly agreed in writing, OmniTech is not responsible for data loss caused by pre-existing faults, failed storage, malware, user credentials, third-party systems or unavoidable repair processes.",
      "For field work, you must ensure safe access, permission to work on site, required contact persons, roof or equipment access where relevant, and compliance with site safety rules."
    ]
  },
  {
    title: "5. Payments, Deposits, Pre-orders And Collections",
    body: [
      "Payments, deposits and balances are due as stated on the quote, invoice or receipt. Work may be paused until required payments or approvals are received.",
      "Parts, special orders, software licences, hosting, domains, subscriptions and third-party costs may require upfront payment and may be non-refundable once ordered or activated.",
      "Unless a product listing expressly states and labels a device as Brand New, most store devices are supplied as A+ grade refurbished. The product condition shown on the listing and confirmed before payment forms part of the order terms.",
      "A pre-order is subject to supplier availability, final condition confirmation, estimated fulfilment time and the deposit terms displayed or quoted before payment.",
      "Devices or equipment should be collected promptly after completion. Storage, follow-up or disposal rules may be stated on the job card, invoice or collection notice."
    ]
  },
  {
    title: "6. Warranties And Limitations",
    body: [
      "Warranty coverage, if any, is stated on the repair note, invoice, warranty card or service report. Warranty does not cover misuse, liquid damage, physical damage, unauthorised repair attempts, power surges, malware, customer configuration changes, consumables, third-party outages or faults unrelated to the work performed.",
      "Repairs on liquid-damaged, previously repaired, heavily damaged or intermittently failing devices may carry limited or no warranty. We will communicate known risks where reasonably possible.",
      "To the maximum extent permitted by law, OmniTech is not liable for indirect loss, lost profits, lost data, business interruption, third-party service failure or consequential damages."
    ]
  },
  {
    title: "7. Software, Websites And AI Systems",
    body: [
      "Software, web and AI work may be delivered in phases, such as discovery, design, build, testing, launch and support. Scope, deliverables, timelines, licences, source-code access, hosting responsibilities and support arrangements should be confirmed in a proposal or statement of work.",
      "AI outputs may contain errors and should be reviewed by a responsible person before business, legal, financial, safety or technical decisions are made. OmniTech may refuse or limit AI use cases that are unsafe, unlawful, misleading or privacy-invasive.",
      "Unless otherwise agreed in writing, customer-provided content, data, logos and materials remain the customer's responsibility, and the customer confirms that they have the right to use them."
    ]
  },
  {
    title: "8. Accounts, Portal Use And Communications",
    body: [
      "You are responsible for keeping your login details confidential and for activity under your account. Notify us if you suspect unauthorised access.",
      "We may send service updates, quotes, invoices, repair status messages, appointment reminders and support communications by email, phone, SMS, WhatsApp, the customer portal or other agreed channels.",
      "You must not use the platform to upload unlawful, harmful, infringing, abusive or malicious content."
    ]
  },
  {
    title: "9. Third-Party Products And Platforms",
    body: [
      "Some services rely on third-party products and platforms such as Starlink, device manufacturers, payment providers, hosting providers, email services, WhatsApp, Vercel, software vendors and internet service providers.",
      "Those third parties may have their own terms, prices, warranties, service levels and privacy practices. OmniTech is not responsible for third-party outages, policy changes, account restrictions, hardware defects or supplier delays outside our control."
    ]
  },
  {
    title: "10. Changes, Suspension And Refusal Of Service",
    body: [
      "We may update these terms from time to time. The current version will be published on this page.",
      "We may suspend or refuse service where there is non-payment, unsafe access, suspected fraud, abuse, unlawful activity, privacy risk, security risk or conflict with these terms."
    ]
  }
];

export default function TermsOfServicePage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd(),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Terms of Service", path: "/terms-of-service" }
            ])
          ])
        }}
      />
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Legal terms</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-ink md:text-6xl">Terms of Service</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            These terms explain how {brand.name} provides repairs, ICT support, installations, software, AI automation and platform services.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-4 pb-14">
        {terms.map((section) => (
          <article key={section.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-ink">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}

        <div className="rounded-lg border border-line bg-cloud p-6">
          <h2 className="text-xl font-bold text-ink">Questions</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            For questions about these terms, contact {brand.name} at{" "}
            <a href={`mailto:${brand.email}`} className="font-semibold text-teal hover:text-ink">
              {brand.email}
            </a>
            , call {brand.phone}, or{" "}
            <a href={whatsappHref} className="font-semibold text-teal hover:text-ink">
              chat on WhatsApp
            </a>
            .
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Last updated: June 5, 2026. Also see the{" "}
            <Link href="/privacy-policy" className="font-semibold text-teal hover:text-ink">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
