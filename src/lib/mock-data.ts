export interface Listing {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  features: string[];
  imageUrl: string;
  previewUrl?: string;
  rating: number;
  salesCount: number;
}

export const CATEGORIES = [
  "All",
  "Web Apps",
  "Website Themes",
  "AI Cybersecurity",
  "System Development",
  "Full Stack Services",
  "Portfolio Templates",
  "Admin Dashboards"
];

export const LISTINGS: Listing[] = [
  {
    id: "1",
    name: "Aura E-Commerce Theme",
    category: "Website Themes",
    price: 49,
    description: "A professional, lightning-fast React theme for modern e-commerce stores. Optimized for SEO and mobile users.",
    features: ["Fully Responsive", "Dark Mode Support", "SEO Optimized", "High Conversion Checkout"],
    imageUrl: "https://picsum.photos/seed/theme1/600/400",
    previewUrl: "https://demo.s-tech.io/aura",
    rating: 4.8,
    salesCount: 124
  },
  {
    id: "2",
    name: "Sentinel AI Defender",
    category: "AI Cybersecurity",
    price: 299,
    description: "Automated threat detection and real-time incident response powered by machine learning algorithms tailored for SMBs.",
    features: ["24/7 Monitoring", "ML Pattern Detection", "Auto-Remediation", "Security Reports"],
    imageUrl: "https://picsum.photos/seed/security1/600/400",
    previewUrl: "https://demo.s-tech.io/sentinel",
    rating: 4.9,
    salesCount: 56
  },
  {
    id: "3",
    name: "Nova SaaS Boilerplate",
    category: "Web Apps",
    price: 199,
    description: "Jumpstart your next big idea with our feature-rich SaaS boilerplate. Includes auth, payments, and multi-tenancy.",
    features: ["Next.js & TypeScript", "Stripe Integration", "Supabase Ready", "Admin Dashboard"],
    imageUrl: "https://picsum.photos/seed/webapp1/600/400",
    previewUrl: "https://demo.s-tech.io/nova",
    rating: 4.7,
    salesCount: 89
  },
  {
    id: "4",
    name: "Custom Enterprise Portal",
    category: "System Development",
    price: 1500,
    description: "A tailored internal management system for large organizations. Built with scalability and security as top priorities.",
    features: ["RBAC Security", "Big Data Visualization", "Third-party Integrations", "On-prem Support"],
    imageUrl: "https://picsum.photos/seed/system1/600/400",
    previewUrl: "https://demo.s-tech.io/portal",
    rating: 5.0,
    salesCount: 12
  },
  {
    id: "5",
    name: "Photinia Portfolio Template",
    category: "Portfolio Templates",
    price: 29,
    description: "A clean and minimal portfolio template for creatives, photographers, and freelancers.",
    features: ["Light/Dark Mode", "Gallery Layouts", "Contact Form", "Blog Support"],
    imageUrl: "https://picsum.photos/seed/portfolio1/600/400",
    previewUrl: "https://demo.s-tech.io/photinia",
    rating: 4.6,
    salesCount: 210
  },
  {
    id: "6",
    name: "Nimbus Dashboard UI Kit",
    category: "Admin Dashboards",
    price: 99,
    description: "A modern admin dashboard with charts, tables, and customizable widgets built with React and Tailwind.",
    features: ["Chart.js Integration", "Responsive Layout", "Dark Mode", "Reusable Components"],
    imageUrl: "https://picsum.photos/seed/dashboard1/600/400",
    previewUrl: "https://demo.s-tech.io/nimbus",
    rating: 4.9,
    salesCount: 78
  },
  {
    id: "7",
    name: "Flux Blog Theme",
    category: "Website Themes",
    price: 35,
    description: "A fast, SEO-friendly blog theme optimized for long-form content and readability.",
    features: ["AMP Ready", "Syntax Highlighting", "Custom Widgets", "Disqus Comments"],
    imageUrl: "https://picsum.photos/seed/blog1/600/400",
    previewUrl: "https://demo.s-tech.io/flux",
    rating: 4.5,
    salesCount: 143
  },
  {
    id: "8",
    name: "Atlas Conference Website",
    category: "Web Apps",
    price: 499,
    description: "Complete event site with schedule, speaker profiles and ticketing integration.",
    features: ["Stripe Tickets", "Map Integration", "Agenda Builder", "Multilingual"],
    imageUrl: "https://picsum.photos/seed/conference1/600/400",
    previewUrl: "https://demo.s-tech.io/atlas",
    rating: 4.7,
    salesCount: 34
  }
];

export interface Inquiry {
  id: string;
  listingId: string;
  listingName: string;
  userName: string;
  userEmail: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  date: string;
}

export const INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    listingId: "2",
    listingName: "Sentinel AI Defender",
    userName: "Tendai M.",
    userEmail: "tendai@company.zw",
    message: "I'm interested in deploying this for our financial firm in Harare. Do you offer setup assistance?",
    status: 'pending',
    date: "2023-10-24"
  },
  {
    id: "inq-2",
    listingId: "1",
    listingName: "Aura E-Commerce Theme",
    userName: "Sarah K.",
    userEmail: "sarah@boutique.co.zw",
    message: "Does this theme support multi-language options for Shona and Ndebele?",
    status: 'responded',
    date: "2023-10-22"
  }
];