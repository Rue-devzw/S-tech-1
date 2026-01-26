'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const content = {
    'software-systems': {
        title: 'Software & Digital Systems Engineering',
        tagline: 'High-Performance Intelligence',
        description: 'We build high-performance web applications and automated systems that solve complex business challenges with technical precision.',
        icon: Cpu,
        who_its_for: 'Businesses looking for reliable, automated software that can handle growth and reduce manual work.',
        problems_solved: [
            {
                title: 'Data Disconnect',
                desc: 'Turning scattered data into clear, actionable business insights.',
                icon: Zap
            },
            {
                title: 'Manual Bottlenecks',
                desc: 'Replacing slow, error-prone manual tasks with fast, reliable software automation.',
                icon: Cpu
            },
            {
                title: 'Security Risks',
                desc: 'Building secure digital foundations that protect your business and client data.',
                icon: Shield
            }
        ],
        process: ['Concept Discovery', 'Architecture Blueprint', 'Development Phase', 'Testing & Integration', 'Deployment & Growth'],
        technologies: ['Next.js', 'PostgreSQL', 'Python (AI)', 'AWS', 'TensorFlow'],
        cta_text: 'Talk to an Engineer'
    },
    'digital-growth': {
        title: 'Digital Branding, Design & Growth',
        tagline: 'Strategic Market Authority',
        description: 'We combine premium design with strategic SEO to ensure your brand stands out and attracts high-quality business leads.',
        icon: Zap,
        who_its_for: 'Companies ready to establish a professional online presence and dominate their local or global market.',
        problems_solved: [
            {
                title: 'Hidden Online',
                desc: 'Technical search optimization that puts your business in front of the right customers.',
                icon: Zap
            },
            {
                title: 'Lack of Credibility',
                desc: 'High-end visual branding that builds instant trust and authority with your audience.',
                icon: Shield
            },
            {
                title: 'Missed Leads',
                desc: 'Effective conversion paths that turn website visitors into paying clients.',
                icon: ArrowRight
            }
        ],
        process: ['Market Research', 'Brand Design', 'Content Launch', 'Traffic Growth', 'Lead Optimization'],
        technologies: ['SEO Engine', 'Adobe Creative Cloud', 'Google Analytics', 'Framer'],
        cta_text: 'Grow Your Brand'
    },
    'device-repairs': {
        title: 'Device & Computer Repair Services',
        tagline: 'Expert Hardware Restoration',
        description: 'Professional hardware repair services since 2014. We fix everything from cracked screens to complex motherboard issues with precision.',
        icon: Wrench,
        who_its_for: 'Individuals and businesses who need fast, reliable, and honest repairs for their critical technology.',
        problems_solved: [
            {
                title: 'Hardware Failure',
                desc: 'Expert component-level repairs that save you the cost of full replacements.',
                icon: Cpu
            },
            {
                title: 'Lost Information',
                desc: 'Secure data recovery and system restoration for mobile and laptop devices.',
                icon: Wrench
            },
            {
                title: 'Slow Performance',
                desc: 'Complete servicing to get your computers and gadgets running like new again.',
                icon: Shield
            }
        ],
        process: ['Expert Diagnosis', 'Technical Quote', 'Professional Repair', 'Rigorous Testing', 'Final Certification'],
        technologies: ['Microsoldering Lab', 'Digital Forensics', 'Logic Pro Diagnostics', 'OEM Parts'],
        cta_text: 'Get a Repair Quote'
    }
};

export default function ServiceCategoryPage() {
    const params = useParams();
    const category = params.category as string;
    const data = content[category as keyof typeof content];

    if (!data) return <div className="pt-v-4 text-center font-primary text-scale-3 font-bold uppercase tracking-widest">404 | CATEGORY NOT FOUND</div>;

    return (
        <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
            <div className="container mx-auto px-v-1">
                {/* Hero / Overview Section */}
                <div className="grid lg:grid-cols-12 gap-v-4 items-end mb-v-4">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-8 space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">{data.tagline}</div>
                            <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-[0.9] uppercase">
                                {data.title}
                            </h1>
                            <p className="text-scale-2 md:text-scale-3 text-muted-foreground font-medium leading-relaxed max-w-2xl font-secondary italic">
                                {data.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Button asChild size="lg" className="h-14 px-10 text-[10px] font-bold uppercase tracking-widest bg-primary rounded-none transition-all duration-700">
                                <Link href="/booking">{data.cta_text}</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-[10px] font-bold uppercase tracking-widest border border-border/50 rounded-none transition-all duration-700">
                                <Link href="/portfolio">Review Capability</Link>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-4 aspect-[4/5] bg-card border-l border-t border-border relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-15 transition-opacity duration-1000">
                            <data.icon className="h-64 w-64 text-primary" />
                        </div>
                        <div className="absolute bottom-12 left-12 right-12 space-y-4">
                            <div className="h-px w-24 bg-primary" />
                            <h3 className="text-scale-2 font-bold uppercase tracking-tighter">Objective <br />Architect.</h3>
                        </div>
                    </motion.div>
                </div>

                {/* Who It's For Section */}
                <section className="py-v-3 border-y border-border mb-v-4">
                    <div className="grid lg:grid-cols-12 gap-v-2 items-center">
                        <div className="lg:col-span-4">
                            <h2 className="text-scale-3 font-bold uppercase tracking-widest">Who It's For</h2>
                        </div>
                        <div className="lg:col-span-8">
                            <p className="text-scale-2 font-secondary italic text-muted-foreground leading-relaxed">
                                {data.who_its_for}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Problems Solved / Features Grid */}
                <div className="mb-v-4">
                    <h2 className="text-scale-3 font-bold uppercase tracking-widest mb-v-2 text-center">Problems Solved</h2>
                    <div className="grid md:grid-cols-3 gap-px bg-border">
                        {data.problems_solved.map((problem, i) => (
                            <div key={i} className="bg-background p-12 md:p-16 space-y-8 hover:bg-card transition-colors duration-700 group">
                                <problem.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-700" />
                                <div className="space-y-4">
                                    <h4 className="text-scale-2 font-bold tracking-tight uppercase">{problem.title}</h4>
                                    <p className="text-scale-1 text-muted-foreground font-medium leading-relaxed font-secondary italic">{problem.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process Roadmap */}
                <div className="space-y-16 mb-v-4">
                    <div className="text-center space-y-4">
                        <h2 className="text-scale-3 font-bold uppercase tracking-[0.3em]">The Process</h2>
                        <div className="h-px w-24 bg-primary mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-5 gap-px bg-border">
                        {data.process.map((step, i) => (
                            <div key={i} className="relative p-10 bg-background space-y-6 text-center group overflow-hidden">
                                <div className="text-scale-3 font-bold text-primary opacity-5 group-hover:opacity-100 transition-opacity duration-1000">0{i + 1}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground group-hover:text-foreground transition-colors">{step}</div>
                                <div className="absolute -bottom-px left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technologies Section */}
                <section className="py-v-3 border-t border-border mb-v-4">
                    <h2 className="text-scale-3 font-bold uppercase tracking-widest text-center mb-v-2">Technologies Used</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {data.technologies.map((tech, i) => (
                            <span key={i} className="px-6 py-2 border border-border bg-card text-[10px] font-bold uppercase tracking-widest text-primary">
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Final CTA Overlay */}
                <div className="mt-v-5 bg-card border border-border p-16 md:p-32 text-center space-y-12 overflow-hidden relative">
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-none uppercase">
                            Deterministic <br /><span className="text-primary italic font-secondary tracking-normal">Success.</span>
                        </h2>
                        <p className="text-muted-foreground text-scale-2 font-bold uppercase tracking-[0.4em] max-w-xl mx-auto font-secondary italic">
                            Slot availability restricted for Q1.
                        </p>
                        <Button asChild className="h-20 px-16 text-scale-2 font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none transition-all duration-700">
                            <Link href="/booking">{data.cta_text}</Link>
                        </Button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] border border-primary/5 rounded-full -z-10 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
