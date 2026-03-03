export interface Listing {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  description: string;
  client: string;
  industry: string;
  deliveryTimeline: string;
  supportWindow: string;
  featured: boolean;
  technologies: string[];
  features: string[];
  outcomes: string[];
  imageUrl: string;
  previewUrl?: string;
  rating: number;
  salesCount: number;
}

export const CATEGORIES = [
  "All",
  "Web Platforms",
  "AI Security",
  "SaaS Products",
  "Data Systems",
  "Design Systems",
  "Commerce",
  "Mobile Apps",
];

export const LISTINGS: Listing[] = [
  {
    id: "st-001",
    slug: "crownbank-fraud-shield",
    name: "CrownBank Fraud Shield",
    category: "AI Security",
    price: 4200,
    shortDescription: "Real-time fraud detection suite for card and mobile transactions.",
    description:
      "An enterprise risk intelligence platform engineered for financial institutions handling high-volume transactional traffic. It combines behavioral biometrics, rules engines, and machine-learning scoring to stop fraud before settlement.",
    client: "CrownBank Zimbabwe",
    industry: "Financial Services",
    deliveryTimeline: "6 weeks",
    supportWindow: "12 months priority support",
    featured: true,
    technologies: ["Next.js", "Python", "PostgreSQL", "Redis", "Kafka"],
    features: [
      "Real-time anomaly scoring under 200ms",
      "Analyst case queue with evidence trail",
      "Customer risk profiling and velocity checks",
      "Automated escalation to SOC and SMS alerts",
    ],
    outcomes: [
      "Reduced card fraud losses by 41%",
      "Cut manual review workload by 58%",
      "Improved dispute resolution time by 2.1x",
    ],
    imageUrl: "https://images.unsplash.com/photo-1556741533-f6acd647d2fb?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/crownbank-fraud-shield",
    rating: 5.0,
    salesCount: 18,
  },
  {
    id: "st-002",
    slug: "agriflow-distributor-cloud",
    name: "AgriFlow Distributor Cloud",
    category: "Web Platforms",
    price: 2350,
    shortDescription: "Inventory, route planning, and collections platform for agri distributors.",
    description:
      "A unified platform for distribution operations across multi-branch agricultural supply chains. Teams manage warehouse stock, delivery routes, field collections, and outstanding invoices from a single command center.",
    client: "ZimAgri Supply Co.",
    industry: "Agriculture",
    deliveryTimeline: "5 weeks",
    supportWindow: "9 months managed support",
    featured: true,
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Mapbox", "Stripe"],
    features: [
      "Real-time stock visibility per depot",
      "Delivery dispatch with driver mobile view",
      "Offline-first field collections",
      "Automated customer statements",
    ],
    outcomes: [
      "Improved order fulfillment by 33%",
      "Reduced fuel waste by 22%",
      "Lowered aged receivables by 27%",
    ],
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/agriflow",
    rating: 4.9,
    salesCount: 36,
  },
  {
    id: "st-003",
    slug: "nova-saas-control-plane",
    name: "Nova SaaS Control Plane",
    category: "SaaS Products",
    price: 890,
    shortDescription: "Production-ready SaaS starter with billing, auth, and tenant controls.",
    description:
      "A mature SaaS foundation used by teams launching B2B products quickly with governance in place from day one. Includes onboarding, subscriptions, feature flags, and role-based permissions for scale.",
    client: "Product Teams",
    industry: "Software",
    deliveryTimeline: "Instant access + 2-day setup support",
    supportWindow: "6 months updates",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Stripe", "Supabase", "Resend"],
    features: [
      "Multi-tenant auth and access policies",
      "Subscription billing and invoicing",
      "Built-in analytics and audit logs",
      "Admin console with account health metrics",
    ],
    outcomes: [
      "Launches in under 2 weeks",
      "Reduced boilerplate engineering by ~70%",
      "Cuts early-stage security regressions",
    ],
    imageUrl: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/nova",
    rating: 4.8,
    salesCount: 142,
  },
  {
    id: "st-004",
    slug: "pulsecare-patient-experience-app",
    name: "PulseCare Patient Experience App",
    category: "Mobile Apps",
    price: 3200,
    shortDescription: "Appointment, reminders, tele-consult, and triage app for private clinics.",
    description:
      "A patient-facing mobile product for modern clinics, focused on reducing no-shows and improving communication. Features secure messaging, appointment booking, medication reminders, and clinician escalation workflows.",
    client: "PulseCare Medical Group",
    industry: "Healthcare",
    deliveryTimeline: "7 weeks",
    supportWindow: "12 months standard support",
    featured: false,
    technologies: ["React Native", "Node.js", "Firebase", "Twilio", "PostgreSQL"],
    features: [
      "Appointment management with smart reminders",
      "Tele-consult handoff and follow-ups",
      "Secure patient messaging",
      "Care analytics for clinic managers",
    ],
    outcomes: [
      "No-show rate reduced by 29%",
      "Patient response times improved by 2.6x",
      "Higher retention for recurring care plans",
    ],
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/pulsecare",
    rating: 4.9,
    salesCount: 21,
  },
  {
    id: "st-005",
    slug: "ledgerflow-executive-dashboard",
    name: "LedgerFlow Executive Dashboard",
    category: "Data Systems",
    price: 1800,
    shortDescription: "Board-ready finance and operations dashboard with drill-down intelligence.",
    description:
      "An executive analytics workspace designed for high-level decision making. It aggregates sales, profitability, operational, and risk data into one elegant interface with deep drill-down on demand.",
    client: "Mid-Market Enterprises",
    industry: "Multi-sector",
    deliveryTimeline: "4 weeks",
    supportWindow: "6 months",
    featured: true,
    technologies: ["Next.js", "Recharts", "PostgreSQL", "dbt", "Metabase"],
    features: [
      "Cross-department KPI tracking",
      "Role-specific dashboards",
      "Automated executive reports",
      "Forecast trend overlays",
    ],
    outcomes: [
      "Decision cycles reduced by 35%",
      "Monthly reporting time cut from 3 days to 4 hours",
      "Improved KPI accountability",
    ],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/ledgerflow",
    rating: 4.7,
    salesCount: 63,
  },
  {
    id: "st-006",
    slug: "aurora-commerce-accelerator",
    name: "Aurora Commerce Accelerator",
    category: "Commerce",
    price: 540,
    shortDescription: "High-conversion storefront framework for ambitious digital brands.",
    description:
      "A premium commerce framework blending performance, visual polish, and conversion design. Built for teams that need a storefront that looks world-class and sells consistently across devices.",
    client: "D2C Brands",
    industry: "Retail",
    deliveryTimeline: "Instant access + onboarding",
    supportWindow: "6 months updates",
    featured: false,
    technologies: ["Next.js", "Tailwind CSS", "Shopify", "Algolia"],
    features: [
      "Conversion-optimized PDP and checkout flow",
      "Intelligent product search",
      "Campaign landing page builder",
      "Performance budget guardrails",
    ],
    outcomes: [
      "Average conversion uplift of 18%",
      "Time-to-launch reduced by 60%",
      "Improved Core Web Vitals across devices",
    ],
    imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/aurora-commerce",
    rating: 4.8,
    salesCount: 94,
  },
  {
    id: "st-007",
    slug: "northstar-design-system",
    name: "Northstar Design System",
    category: "Design Systems",
    price: 760,
    shortDescription: "Comprehensive component system and brand tokens for product teams.",
    description:
      "A robust design system package that aligns product, engineering, and brand. Ships with audited accessibility standards, reusable UI primitives, and documentation kits to accelerate team velocity.",
    client: "Scaling Product Teams",
    industry: "Software",
    deliveryTimeline: "3 weeks",
    supportWindow: "3 months advisory",
    featured: false,
    technologies: ["Figma", "TypeScript", "Storybook", "Tailwind CSS"],
    features: [
      "Token-driven visual consistency",
      "Accessible component variants",
      "Design-to-code handoff standards",
      "Governance workflow templates",
    ],
    outcomes: [
      "Reduced UI inconsistency defects",
      "Faster release cycles for frontend teams",
      "Improved design-engineering collaboration",
    ],
    imageUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/northstar",
    rating: 4.6,
    salesCount: 58,
  },
  {
    id: "st-008",
    slug: "citylink-service-portal",
    name: "CityLink Service Portal",
    category: "Web Platforms",
    price: 2700,
    shortDescription: "Citizen request management and SLA tracking portal for local authorities.",
    description:
      "A modern service portal for municipalities and public service teams to intake, route, and resolve citizen requests transparently while measuring SLA adherence across departments.",
    client: "City Operations Teams",
    industry: "Public Sector",
    deliveryTimeline: "8 weeks",
    supportWindow: "12 months",
    featured: false,
    technologies: ["Next.js", "Node.js", "PostgreSQL", "GIS APIs"],
    features: [
      "Omnichannel request intake",
      "Department routing and escalation",
      "Public status tracking",
      "SLA and backlog analytics",
    ],
    outcomes: [
      "Improved response transparency for citizens",
      "Reduced unresolved backlog by 31%",
      "Stronger service-level accountability",
    ],
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
    previewUrl: "https://demo.s-tech.africa/citylink",
    rating: 4.7,
    salesCount: 24,
  },
];

export interface Inquiry {
  id: string;
  listingId: string;
  listingName: string;
  userName: string;
  userEmail: string;
  message: string;
  status: "pending" | "responded" | "closed";
  date: string;
}

export const INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    listingId: "st-001",
    listingName: "CrownBank Fraud Shield",
    userName: "Tendai M.",
    userEmail: "tendai@crownbank.co.zw",
    message: "Can your team support phased rollout across two business units before full deployment?",
    status: "pending",
    date: "2026-02-24",
  },
  {
    id: "inq-2",
    listingId: "st-006",
    listingName: "Aurora Commerce Accelerator",
    userName: "Sarah K.",
    userEmail: "sarah@atelier.co.zw",
    message: "We need localized checkout fields for Zimbabwe and Zambia. Is this included?",
    status: "responded",
    date: "2026-02-27",
  },
  {
    id: "inq-3",
    listingId: "st-005",
    listingName: "LedgerFlow Executive Dashboard",
    userName: "Brian N.",
    userEmail: "brian@northstar.africa",
    message: "Do you support nightly ETL from Sage and SAP into the dashboard dataset?",
    status: "closed",
    date: "2026-02-20",
  },
];
