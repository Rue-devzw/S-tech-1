import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/site-shell";
import { brand } from "@/lib/constants";
import { whatsappHref } from "@/lib/public-content";
import { breadcrumbJsonLd, makeMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for OmniTech Solutions customer portal, repairs, installations, software services, AI automation and communications.",
  path: "/privacy-policy",
  keywords: ["OmniTech privacy policy", "data protection Zimbabwe", "customer data repairs ICT services"]
});

const privacySections = [
  {
    title: "1. Who We Are",
    body: [
      `${brand.name} provides technology services including repairs, ICT support, networking, Starlink installation support, web development, software systems and AI automation.`,
      `For privacy questions, contact us at ${brand.email} or ${brand.phone}.`
    ]
  },
  {
    title: "2. Information We Collect",
    body: [
      "We may collect your name, phone number, email address, organisation, billing details, service address, device details, serial numbers, repair symptoms, photos, site notes, account login details, customer messages, quotations, invoices, payments, warranty records and support history.",
      "For field work, we may collect appointment details, site access notes, installation photos, checklists, signatures, location-related information and service reports.",
      "For software, website and AI projects, we may process project requirements, user roles, business workflow information, uploaded documents, prompts, generated drafts, approval records and technical logs.",
      "We may also collect technical data such as IP address, browser type, device information, cookies, security logs and platform usage events."
    ]
  },
  {
    title: "3. How We Use Information",
    body: [
      "We use information to receive and manage service requests, diagnose faults, prepare quotes, schedule work, communicate updates, complete repairs or installations, issue invoices and receipts, provide warranties, operate customer/admin/technician portals, improve services and protect the platform.",
      "We use communications data to send service updates, appointment reminders, quote and invoice messages, support replies, customer follow-ups and important operational notices.",
      "Where AI tools are used, we use the minimum practical context needed to generate drafts, troubleshooting suggestions, reports or workflow assistance. AI outputs should be reviewed before use."
    ]
  },
  {
    title: "4. Legal And Operational Basis",
    body: [
      "We process information to perform requested services, take steps before entering a service agreement, comply with legal and accounting duties, protect our systems and customers, manage legitimate business operations, and where required, with your consent.",
      "Zimbabwe's Cyber and Data Protection Act provides the main data-protection framework, and POTRAZ is identified as the Data Protection Authority. We aim to handle personal information in line with applicable data-protection principles."
    ]
  },
  {
    title: "5. Sharing Information",
    body: [
      "We may share information with staff, technicians, field installers, support personnel and service providers who need it to perform their work.",
      "We may use providers for hosting, databases, file storage, email, SMS, WhatsApp, analytics, payments, backups, AI processing and security. These providers may process information on our behalf or under their own applicable terms.",
      "We may disclose information when required by law, to enforce agreements, to prevent fraud or abuse, to protect customers and systems, or in connection with a business transfer."
    ]
  },
  {
    title: "6. Storage, Security And Retention",
    body: [
      "We use technical and organisational measures such as access controls, authentication, HTTPS, encrypted secrets, role-based permissions, audit logs, data minimisation and secure hosting practices.",
      "No system is perfectly secure. You should keep account credentials confidential and avoid sending unnecessary sensitive information through public or shared channels.",
      "We keep information only for as long as reasonably needed for service delivery, warranty support, accounting, legal, security, dispute-resolution, backup and legitimate operational purposes."
    ]
  },
  {
    title: "7. Customer Uploads, Devices And Data",
    body: [
      "Photos, files, device evidence, documents and service notes uploaded to the platform may be stored with our hosting or storage providers.",
      "You should remove or back up personal files before handing over devices where possible. Repairs and diagnostics may expose data stored on a device. We limit access to what is needed for service delivery, testing and quality control.",
      "Do not upload content that you are not authorised to share, including third-party confidential information, unlawful material or unnecessary sensitive personal data."
    ]
  },
  {
    title: "8. International Services And Third Parties",
    body: [
      "Some providers may store or process data outside Zimbabwe. This may include cloud hosting, storage, communications, AI, payment or support providers.",
      "Third-party platforms such as WhatsApp, payment services, Starlink, hosting providers, Vercel and other vendors have their own privacy practices. You should review their policies when using those services."
    ]
  },
  {
    title: "9. Your Choices And Requests",
    body: [
      "You may contact us to request access, correction, update or deletion of your personal information, subject to identity verification and legal, accounting, warranty, security or operational retention needs.",
      "You may opt out of non-essential marketing messages. We may still send transactional or service-related messages such as quotes, invoices, repair updates, appointment notices and security alerts."
    ]
  },
  {
    title: "10. Children And Sensitive Information",
    body: [
      "The platform is intended for customers, businesses and authorised users. Children should use the service only through a parent, guardian, school, organisation or authorised adult.",
      "Avoid sharing sensitive information unless it is necessary for the service. If sensitive information is required, we will handle it with additional care appropriate to the circumstances."
    ]
  },
  {
    title: "11. Changes To This Policy",
    body: [
      "We may update this Privacy Policy as our services, providers, legal duties or platform features change. The current version will be published on this page."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd(),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Privacy Policy", path: "/privacy-policy" }
            ])
          ])
        }}
      />
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Privacy and data protection</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-ink md:text-6xl">Privacy Policy</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
            This policy explains how {brand.name} collects, uses, stores and shares information across repairs, field work, software services, AI automation and the customer platform.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-4 pb-14">
        {privacySections.map((section) => (
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
          <h2 className="text-xl font-bold text-ink">Contact For Privacy Requests</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Email{" "}
            <a href={`mailto:${brand.email}`} className="font-semibold text-teal hover:text-ink">
              {brand.email}
            </a>
            , call {brand.phone}, or{" "}
            <a href={whatsappHref} className="font-semibold text-teal hover:text-ink">
              chat on WhatsApp
            </a>
            . We may need to verify your identity before acting on a privacy request.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Last updated: June 5, 2026.{" "}
            <Link href="/terms-of-service" className="font-semibold text-teal hover:text-ink">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
