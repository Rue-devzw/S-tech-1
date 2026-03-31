export interface Listing {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  description: string;
  challenge?: string;
  approach?: string;
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
  "Portfolio Websites",
  "Agency Platforms",
  "Mobile Apps",
];

export const LISTINGS: Listing[] = [
  {
    id: "st-001",
    slug: "valleyfarm-secrets",
    name: "Valleyfarm Secrets",
    category: "Portfolio Websites",
    price: 0,
    shortDescription:
      "A produce and wholesale website presenting Valley Farm Secrets' farm-fresh offer, services, and partnership model more clearly online.",
    description:
      "Valley Farm Secrets serves customers and producers with a broader story than a simple storefront. The site brings together fresh produce messaging, service categories, partnership calls-to-action, and digital ordering paths so the business feels both community-rooted and commercially ready.",
    challenge:
      "The brand needed to communicate freshness, trust, and convenience while also making room for wholesale enquiries, producer relationships, digital services, and direct contact details.",
    approach:
      "I treated it as a service-rich business website, with a hero focused on freshness and convenience, clear service grouping, and direct paths into online shopping, partnership, and contact actions.",
    client: "Valley Farm Secrets",
    industry: "Agriculture and Retail",
    deliveryTimeline: "Business website",
    supportWindow: "Featured portfolio project",
    featured: true,
    technologies: ["Wholesale", "Online Store", "Producer Partnerships", "Gweru"],
    features: [
      "Our Services",
      "Why Choose Valley Farm Secrets?",
      "Our Story",
      "Let’s Make an Impact Together",
      "Shop Online",
    ],
    outcomes: [
      "Surfaces freshness, quality, and convenience as the core promise",
      "Balances produce sales, wholesale access, and producer partnership messaging",
      "Links commercial service with local community impact and youth employment",
    ],
    imageUrl: "/images/dev-project-2.webp",
    previewUrl: "https://www.valleyfarmsecrets.com/",
    rating: 5.0,
    salesCount: 3,
  },
  {
    id: "st-002",
    slug: "mussyconsultation-agency",
    name: "Mussyconsultation Agency",
    category: "Agency Platforms",
    price: 0,
    shortDescription:
      "A study-abroad consultancy platform that packages services, destinations, and consultation funnels into a more credible digital journey.",
    description:
      "Mussy Consultancy Agency positions itself as a study abroad partner for ambitious students, so the website needed to do more than list services. It had to build confidence with proof points, destination guidance, scholarship positioning, and a clear path into advisor conversations.",
    challenge:
      "The experience needed to carry a lot of guidance content while still feeling aspirational and easy to navigate for students comparing destinations, services, and scholarship support.",
    approach:
      "I leaned into a conversion-focused agency layout: strong hero messaging, credibility statistics, milestone-based service explanation, destination discovery, and clear consultation calls-to-action.",
    client: "Mussyconsultation Agency",
    industry: "Education Consultancy",
    deliveryTimeline: "Consultancy platform",
    supportWindow: "Featured portfolio project",
    featured: true,
    technologies: ["Study Abroad", "Scholarships", "Destinations", "Consultations"],
    features: [
      "Your journey, expertly orchestrated",
      "Strategic guidance at every milestone",
      "Global destinations, tailored to you",
      "A proven journey to your dream campus",
      "Let’s co-create your acceptance strategy",
    ],
    outcomes: [
      "Frames the agency as a trusted study abroad partner since 2012",
      "Leads with 4,500+ students placed, 120+ partner universities, 98% visa success rate, and $3M in scholarships",
      "Turns complex study-abroad services into a guided four-phase journey from Discover to Thrive",
    ],
    imageUrl: "/images/dev-project-1.webp",
    previewUrl: "https://www.mussyconsultancy.org/",
    rating: 4.9,
    salesCount: 2,
  },
  {
    id: "st-003",
    slug: "afc-hymns-collection",
    name: "AFC Hymns Collection",
    category: "Mobile Apps",
    price: 0,
    shortDescription:
      "An offline Android hymnbook app for Apostolic Faith Church SEAR collections, built to make hymn reading clearer and more accessible.",
    description:
      "AFC Hymns Collection is a Google Play app focused on practical access to church hymnbooks without needing an internet connection. It brings together the Yellow Hymnbook, Ndebele hymn extracts, Sing Praises Unto Our King English hymns, and choruses into a simpler reading experience for everyday use.",
    challenge:
      "Hymn content needs to stay readable offline, easy to browse, and comfortable on mobile screens where typography and update flow matter a lot.",
    approach:
      "I treated it as a utility-first mobile app, prioritizing offline access, clearer fonts for hymn reading, and a dependable update path when new hymns are added.",
    client: "AFC Hymns Collection",
    industry: "Books and Reference",
    deliveryTimeline: "Android app",
    supportWindow: "Featured portfolio project",
    featured: true,
    technologies: ["Android", "Offline Access", "Hymnbooks", "SEAR"],
    features: [
      "About this app",
      "What’s new",
      "Data safety",
      "App support",
      "About the developer",
    ],
    outcomes: [
      "Makes hymn content available offline for everyday use",
      "Emphasizes clearer reading through improved fonts and lightweight mobile presentation",
      "Builds trust with no data shared and no data collected declared on the Play listing",
    ],
    imageUrl: "/images/dev-project-3.webp",
    previewUrl:
      "https://play.google.com/store/apps/details?id=com.afcsear.afc_hymns_collection",
    rating: 4.8,
    salesCount: 1,
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
    message:
      "Can your team support phased rollout across two business units before full deployment?",
    status: "pending",
    date: "2026-02-24",
  },
  {
    id: "inq-2",
    listingId: "st-006",
    listingName: "Aurora Commerce Accelerator",
    userName: "Sarah K.",
    userEmail: "sarah@atelier.co.zw",
    message:
      "We need localized checkout fields for Zimbabwe and Zambia. Is this included?",
    status: "responded",
    date: "2026-02-27",
  },
  {
    id: "inq-3",
    listingId: "st-005",
    listingName: "LedgerFlow Executive Dashboard",
    userName: "Brian N.",
    userEmail: "brian@northstar.africa",
    message:
      "Do you support nightly ETL from Sage and SAP into the dashboard dataset?",
    status: "closed",
    date: "2026-02-20",
  },
];
