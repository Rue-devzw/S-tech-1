import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, MapPin, Mail, Phone, ArrowRight, Lightbulb, Target, Heart } from "lucide-react"

const TEAM = [
    { name: "Solomon Chirisa", role: "Founder & CEO", bio: "15+ years in software engineering; passionate about accelerating digital transformation across Africa.", initials: "SC" },
    { name: "Nomsa Dube", role: "Head of Engineering", bio: "Full-stack architect specialising in scalable cloud infrastructure and microservices.", initials: "ND" },
    { name: "Takudzwa Moyo", role: "Head of AI & Security", bio: "Machine learning engineer with deep expertise in cybersecurity threat detection systems.", initials: "TM" },
    { name: "Rudo Zvenyika", role: "Lead Designer", bio: "UX/UI designer creating beautiful, conversion-focused digital experiences.", initials: "RZ" },
    { name: "Brian Ndlovu", role: "Mobile Development Lead", bio: "Expert React Native developer with 8+ years building cross-platform consumer apps.", initials: "BN" },
    { name: "Sandra Mutasa", role: "Client Success Manager", bio: "Dedicated to ensuring every client achieves measurable ROI from their digital investments.", initials: "SM" },
]

const VALUES = [
    { icon: Lightbulb, title: "Innovation First", desc: "We stay ahead of the technological curve to bring the most modern solutions to our clients.", color: "text-yellow-500", bg: "bg-yellow-100" },
    { icon: Target, title: "Results Driven", desc: "Every engagement is measured by the tangible impact we create for our clients' businesses.", color: "text-blue-600", bg: "bg-blue-100" },
    { icon: Heart, title: "Africa Focused", desc: "We build with a deep understanding of the African market, culture, and digital landscape.", color: "text-red-500", bg: "bg-red-100" },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MainNav />

            <main className="flex-1">
                {/* Hero */}
                <section className="py-24 bg-primary text-white">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <Badge className="mb-6 bg-accent border-none py-1.5 px-4 rounded-full text-sm font-bold uppercase tracking-wider">
                            About S-Tech
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 leading-tight">
                            Building the <span className="text-accent">Digital Future</span> of Africa
                        </h1>
                        <p className="text-lg text-primary-foreground/80 font-light leading-relaxed max-w-2xl mx-auto">
                            Founded in Harare, Zimbabwe, S-Tech Solutions is a premier digital agency dedicated to empowering businesses with cutting-edge technology. From AI-powered security to full-stack web development, we are your trusted partner for digital excellence.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-headline font-bold text-primary mb-6">Our Mission</h2>
                                <p className="text-muted-foreground font-light leading-relaxed mb-6">
                                    We believe every African business deserves access to world-class digital tools and expert development talent. S-Tech bridges that gap — offering enterprise-grade technology at accessible prices, built with a local-first perspective.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Democratize access to advanced technology across Africa",
                                        "Create high-quality software that solves real business problems",
                                        "Empower local talent and grow the African tech ecosystem",
                                        "Deliver measurable ROI on every digital investment",
                                    ].map(item => (
                                        <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { value: "50+", label: "Projects Delivered" },
                                    { value: "8+", label: "Years in Business" },
                                    { value: "12", label: "Team Members" },
                                    { value: "98%", label: "Client Satisfaction" },
                                ].map(stat => (
                                    <div key={stat.label} className="p-6 bg-primary/5 rounded-2xl text-center">
                                        <p className="text-3xl font-headline font-bold text-primary mb-1">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-headline font-bold text-primary mb-12 text-center">Our Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {VALUES.map(v => (
                                <div key={v.title} className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-center">
                                    <div className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                                        <v.icon className={`w-7 h-7 ${v.color}`} />
                                    </div>
                                    <h3 className="text-xl font-headline font-bold text-primary mb-3">{v.title}</h3>
                                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-headline font-bold text-primary mb-4">Meet the Team</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                A diverse group of passionate technologists committed to excellence and African innovation.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {TEAM.map(member => (
                                <Card key={member.name} className="border-none shadow-md hover:shadow-lg transition-all group">
                                    <CardContent className="p-8 text-center">
                                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-accent transition-colors">
                                            <span className="text-white font-headline font-bold text-2xl">{member.initials}</span>
                                        </div>
                                        <h3 className="text-lg font-headline font-bold text-primary mb-1">{member.name}</h3>
                                        <p className="text-xs font-bold text-accent uppercase tracking-wider mb-3">{member.role}</p>
                                        <p className="text-sm text-muted-foreground font-light leading-relaxed">{member.bio}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="py-20 bg-primary/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-headline font-bold text-primary mb-4">Get in Touch</h2>
                            <p className="text-muted-foreground">Have a project in mind? We'd love to hear from you.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
                            {[
                                { icon: MapPin, label: "Address", value: "15 Samora Machel Ave, Harare, Zimbabwe" },
                                { icon: Mail, label: "Email", value: "info@s-tech.co.zw" },
                                { icon: Phone, label: "Phone", value: "+263 77 123 4567" },
                            ].map(contact => (
                                <div key={contact.label} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <contact.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">{contact.label}</p>
                                    <p className="text-sm font-semibold text-primary">{contact.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/services">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-bold">
                                    View Our Services <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary hover:bg-primary/5 font-bold" onClick={() => window.location.href = "mailto:info@s-tech.co.zw"}>
                                Send Us an Email
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
