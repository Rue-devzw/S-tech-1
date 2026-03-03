import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    Code,
    Shield,
    Globe,
    Zap,
    Database,
    Smartphone,
    ArrowRight,
    CheckCircle2,
} from "lucide-react"

const SERVICES = [
    {
        icon: Code,
        title: "Full-Stack Web Development",
        price: "From $500",
        description: "End-to-end web application development using modern frameworks like Next.js, React, and Node.js. We build scalable, performant apps tailored to your business needs.",
        features: ["Custom architecture design", "Database integration", "API development", "Deployment & hosting setup"],
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
    {
        icon: Shield,
        title: "AI Cybersecurity Solutions",
        price: "From $299",
        description: "Protect your business with next-generation AI-powered threat detection, real-time monitoring, and automated incident response systems.",
        features: ["24/7 threat monitoring", "ML-based anomaly detection", "Auto-remediation workflows", "Monthly security reports"],
        color: "text-red-600",
        bg: "bg-red-100",
    },
    {
        icon: Globe,
        title: "Website Themes & Templates",
        price: "From $29",
        description: "Premium, ready-to-deploy website themes and templates for e-commerce, portfolios, and business landing pages. Fully responsive and SEO-optimized.",
        features: ["Mobile-first design", "SEO optimized", "Dark mode support", "One-click customization"],
        color: "text-purple-600",
        bg: "bg-purple-100",
    },
    {
        icon: Database,
        title: "Enterprise System Development",
        price: "From $1,500",
        description: "Custom internal management systems, ERPs, and business portals built with role-based access control and enterprise-grade security for large organizations.",
        features: ["RBAC security", "Big data visualization", "Third-party integrations", "On-premise support"],
        color: "text-green-600",
        bg: "bg-green-100",
    },
    {
        icon: Smartphone,
        title: "Mobile App Development",
        price: "From $800",
        description: "Cross-platform mobile applications for iOS and Android using React Native. We build consumer-grade apps with pixel-perfect UI.",
        features: ["Cross-platform (iOS & Android)", "Offline capability", "Push notifications", "App Store deployment"],
        color: "text-orange-600",
        bg: "bg-orange-100",
    },
    {
        icon: Zap,
        title: "DevOps & Cloud Infrastructure",
        price: "From $400",
        description: "Automate your deployment pipelines, migrate to the cloud, and ensure high availability for your critical applications.",
        features: ["CI/CD pipeline setup", "Docker & Kubernetes", "Cloud migration (AWS/GCP)", "Infrastructure as code"],
        color: "text-cyan-600",
        bg: "bg-cyan-100",
    },
]

export default function ServicesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MainNav />

            <main className="flex-1">
                {/* Hero */}
                <section className="py-20 bg-primary text-white">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <Badge className="mb-6 bg-accent border-none py-1.5 px-4 rounded-full text-sm font-bold uppercase tracking-wider">
                            Professional Services
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-6 leading-tight">
                            Tailored Digital Services for <span className="text-accent">Modern Businesses</span>
                        </h1>
                        <p className="text-lg text-primary-foreground/80 mb-10 font-light">
                            From concept to deployment — S-Tech's expert team delivers end-to-end digital solutions that drive growth and efficiency.
                        </p>
                        <Link href="/#listings">
                            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 text-lg font-bold">
                                Browse Products <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-headline font-bold text-primary mb-4">What We Offer</h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                Comprehensive digital services designed for businesses across Zimbabwe and the broader African market.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {SERVICES.map(svc => (
                                <Card key={svc.title} className="border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                    <CardHeader className="pb-0 p-8">
                                        <div className={`w-14 h-14 rounded-2xl ${svc.bg} flex items-center justify-center mb-5`}>
                                            <svc.icon className={`w-7 h-7 ${svc.color}`} />
                                        </div>
                                        <h3 className="text-xl font-headline font-bold text-primary mb-1">{svc.title}</h3>
                                        <p className="text-accent font-bold text-sm">{svc.price}</p>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 space-y-4">
                                        <p className="text-sm text-muted-foreground font-light leading-relaxed">{svc.description}</p>
                                        <ul className="space-y-2">
                                            {svc.features.map(f => (
                                                <li key={f} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                                                    <span className="text-muted-foreground">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl mt-2 group-hover:bg-accent group-hover:text-white transition-colors">
                                            Get a Quote
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-primary/5">
                    <div className="container mx-auto px-4 text-center max-w-2xl">
                        <h2 className="text-3xl font-headline font-bold text-primary mb-4">Ready to Work With Us?</h2>
                        <p className="text-muted-foreground mb-8">Our team is ready to discuss your project requirements and deliver outstanding results.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/about">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-bold">
                                    Meet the Team
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary/5 font-bold" onClick={() => window.location.href = "mailto:info@s-tech.co.zw"}>
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-headline font-bold text-lg">S</span>
                        </div>
                        <span className="font-headline font-bold text-lg tracking-tight text-primary">
                            S-Tech <span className="text-accent">Solutions</span>
                        </span>
                    </Link>
                    <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} S-Tech Solutions. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
