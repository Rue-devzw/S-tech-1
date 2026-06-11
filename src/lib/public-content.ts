import {
  Bot,
  Code2,
  Cpu,
  Headphones,
  Laptop,
  LucideIcon,
  Network,
  Satellite,
  ShieldCheck,
  Smartphone,
  Tv
} from "lucide-react";

export type PublicService = {
  title: string;
  slug: string;
  eyebrow: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  visualNote: string;
  outcomes: string[];
  process: string[];
  cta: string;
};

export const whatsappHref =
  "https://wa.me/263718704505?text=Hello%20OmniTech%20Solutions%2C%20I%20need%20technology%20support.";

export const whatsappChannelHref = "https://whatsapp.com/channel/0029VaE4TMq545v0wnXxRL0F";

export const publicServices: PublicService[] = [
  {
    title: "Electronics Repairs",
    slug: "electronics-repairs",
    eyebrow: "We repair",
    summary: "Phones, tablets, laptops, TVs and general electronics handled with clear diagnostics and warranty-ready records.",
    description:
      "OmniTech provides structured repair intake, fault diagnosis, parts recommendations, customer approvals and after-service support for consumer and business electronics.",
    icon: Smartphone,
    imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Close-up of an electronics circuit board during technical repair work",
    visualNote: "Bench diagnostics, parts and warranty records",
    outcomes: ["Phone and tablet screen or battery replacement", "PC and laptop diagnostics and upgrades", "TV and power-board servicing", "Repair notes, receipts and warranty records"],
    process: ["Book or walk in", "Device intake and condition check", "Diagnosis and quote", "Repair, quality check and handover"],
    cta: "Book a repair"
  },
  {
    title: "ICT Support",
    slug: "ict-support",
    eyebrow: "We connect",
    summary: "Reliable support for homes, schools, churches, clinics, farms, lodges, SMEs and corporate teams.",
    description:
      "Get help with workstations, printers, routers, email, backups, endpoint setup, user support and recurring technology maintenance.",
    icon: Headphones,
    imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Laptop and support workspace for ICT service desk work",
    visualNote: "Helpdesk, devices, backups and team support",
    outcomes: ["Helpdesk and on-site support", "Device setup and maintenance", "Backup and productivity support", "Preventive maintenance plans"],
    process: ["Log support request", "Triage urgency", "Remote or on-site response", "Resolution notes and follow-up"],
    cta: "Request ICT support"
  },
  {
    title: "Networking",
    slug: "networking",
    eyebrow: "We connect",
    summary: "Structured cabling, Wi-Fi, routers, switches, network maintenance and infrastructure planning.",
    description:
      "OmniTech designs, installs and maintains practical network infrastructure for small offices, schools, churches, lodges, clinics and multi-building sites.",
    icon: Network,
    imageSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Server racks and network infrastructure in a data room",
    visualNote: "Wi-Fi coverage, cabling, routers and switches",
    outcomes: ["Wi-Fi coverage planning", "Router and switch configuration", "Structured cabling", "Network troubleshooting and maintenance"],
    process: ["Site survey", "Network design", "Installation and testing", "Documentation and support"],
    cta: "Plan a network"
  },
  {
    title: "Starlink Installations",
    slug: "starlink-installations",
    eyebrow: "We connect",
    summary: "Starlink kit sales support, site surveys, mounting, cable routing, router setup and commissioning.",
    description:
      "From clear-sky checks to neat cable routing and customer handover, OmniTech makes Starlink installations tidy, documented and supportable.",
    icon: Satellite,
    imageSrc: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Open rural sky and field setting for connectivity planning",
    visualNote: "Clear-sky checks, mounting and handover",
    outcomes: ["Obstruction and placement advice", "Roof or pole mounting", "Router and Wi-Fi setup", "Commissioning report and after-service support"],
    process: ["Confirm kit and site", "Survey mounting location", "Install and route cable", "Run tests and handover"],
    cta: "Install Starlink"
  },
  {
    title: "Web Development",
    slug: "web-development",
    eyebrow: "We build",
    summary: "Modern websites, portals and digital experiences designed to generate trust and convert visitors.",
    description:
      "OmniTech builds fast, responsive websites with content structure, SEO foundations, contact flows and maintainable technology choices.",
    icon: Code2,
    imageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Website development workspace with code on a laptop",
    visualNote: "Sites, portals, landing pages and SEO structure",
    outcomes: ["Business websites", "Service portals", "Landing pages and campaigns", "SEO-ready content structures"],
    process: ["Discovery", "Information architecture", "Design and build", "Launch and measure"],
    cta: "Build a website"
  },
  {
    title: "Software & AI Systems",
    slug: "software-ai-systems",
    eyebrow: "We automate",
    summary: "Custom software, mobile apps, AI assistants, workflow automation and digital transformation systems.",
    description:
      "Turn manual workflows into reliable digital systems with secure apps, dashboards, integrations, AI-assisted processes and reporting.",
    icon: Bot,
    imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Analytics dashboard and software system interface on a screen",
    visualNote: "Apps, dashboards, AI workflows and reporting",
    outcomes: ["Custom business applications", "Mobile app backends", "AI assistants and document automation", "Dashboards, reports and integrations"],
    process: ["Map workflow", "Define MVP", "Build secure system", "Automate and improve"],
    cta: "Automate a workflow"
  }
];

export const serviceHighlights = [
  { title: "Repair-first operations", body: "Every repair request can become a documented job card with diagnosis, parts, approval and warranty." },
  { title: "Field-service ready", body: "Starlink and networking work is structured around site visits, checklists and handover notes." },
  { title: "Software growth path", body: "Web, software and AI work is designed to grow into subscription products and managed services." }
];

export const workScenes = [
  {
    title: "Repair bench",
    label: "Diagnostics",
    imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Electronics circuit board close-up for repair diagnostics"
  },
  {
    title: "Connectivity fieldwork",
    label: "Installations",
    imageSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Network infrastructure equipment for connectivity work"
  },
  {
    title: "Digital systems",
    label: "Builds",
    imageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Website and software development workspace"
  }
];

export const testimonials = [
  {
    quote: "OmniTech handled our connectivity setup neatly and explained every step before handover.",
    name: "Operations Lead",
    company: "Green Valley Lodge"
  },
  {
    quote: "They repaired devices, stabilised our network and gave us clear records for future support.",
    name: "Head Teacher",
    company: "Local Academy"
  },
  {
    quote: "The team understands both technical work and business communication. That combination matters.",
    name: "Clinic Administrator",
    company: "Community Health Centre"
  }
];

export const projects = [
  {
    title: "Valley Farm Secrets",
    category: "Website",
    summary: "Public brand website for valleyfarmsecrets.com with a clean digital presence and customer-facing content structure.",
    imageSrc: "/portfolio/valley-farm-secrets-services.png"
  },
  {
    title: "Mussy Consultancy",
    category: "Website & App",
    summary: "Consultancy website and application experience for mussyconsultancy.org, built around enquiries and service trust.",
    imageSrc: "/portfolio/mussy-consultancy-home.png"
  },
  {
    title: "SME Workflow Portal",
    category: "Software & AI",
    summary: "Customer intake, quote approval and operations dashboard for a growing local service business.",
    imageSrc: "/portfolio/sme-workflow-portal.png"
  }
];

export const createdBrands = [
  { name: "Valley Farm Secrets", href: "https://valleyfarmsecrets.com", domain: "valleyfarmsecrets.com", type: "Website", logoSrc: "/brand/valley-farm-secrets-logo.webp" },
  { name: "Mussy Consultancy", href: "https://mussyconsultancy.org", domain: "mussyconsultancy.org", type: "Website & app", logoSrc: "/brand/mussy-consultancy-logo.png" }
];

export const blogPosts = [
  {
    title: "How to prepare for a Starlink installation",
    slug: "prepare-for-starlink-installation",
    excerpt: "A practical checklist for site access, clear sky view, cable routing, router placement and power stability.",
    category: "Starlink"
  },
  {
    title: "When to repair, upgrade or replace a laptop",
    slug: "repair-upgrade-replace-laptop",
    excerpt: "How to decide whether a repair, RAM upgrade, SSD upgrade or replacement makes better financial sense.",
    category: "Repairs"
  },
  {
    title: "What small businesses should automate first",
    slug: "small-business-automation-first",
    excerpt: "Start with repetitive admin, customer intake, quote follow-ups, reports and document generation.",
    category: "Automation"
  }
];

export const repairTrackingSteps = [
  "Request received",
  "Device checked in",
  "Diagnosis in progress",
  "Quote or approval",
  "Repair in progress",
  "Quality check",
  "Ready for collection"
];

export const audienceSegments = ["Home users", "Schools", "Churches", "Farms", "Lodges", "Clinics", "SMEs", "Corporates"];

export const trustStats = [
  { label: "Service pillars", value: "4" },
  { label: "Core service lines", value: "6" },
  { label: "Support channels", value: "WhatsApp, web, phone" },
  { label: "Built for", value: "Homes and organisations" }
];

export const repairTypes = [
  { icon: Smartphone, title: "Phones and tablets", body: "Screens, batteries, charging faults, camera issues and water-damage triage." },
  { icon: Laptop, title: "PCs and laptops", body: "Diagnostics, SSD/RAM upgrades, operating systems, charging faults and component replacements." },
  { icon: Tv, title: "TVs and electronics", body: "Power faults, boards, audio gear, accessories and general electronics servicing." },
  { icon: Cpu, title: "Parts and warranty", body: "Parts tracking, customer approvals, receipts and workmanship warranty records." }
];

export const ictSupportItems = [
  { icon: ShieldCheck, title: "Business continuity", body: "Backups, endpoint setup, email support and preventive maintenance." },
  { icon: Headphones, title: "User support", body: "Remote and on-site help for teams that need calm, practical support." },
  { icon: Laptop, title: "Device management", body: "Workstations, printers, updates, basic security and asset records." }
];
