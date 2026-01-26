'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Wrench, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const content = {
    'software-systems': {
        title: 'Software & Systems',
        tagline: 'High-Performance Intelligence',
        description: 'We engineer complex digital ecosystems that combine the latest AI advancements with rock-solid architectural principles. Our systems don\'t just perform; they lead.',
        icon: Cpu,
        features: [
            {
                title: 'AI Web Engineering',
                desc: 'Custom web applications with integrated LLMs and intelligent automation.',
                icon: Zap
            },
            {
                title: 'Systems Automation',
                desc: 'Streamlining operations through bespoke software that eliminates manual friction.',
                icon: Cpu
            },
            {
                title: 'Enterprise Architecture',
                desc: 'Scalable, secure, and future-proof digital foundations for growing organizations.',
                icon: Shield
            }
        ],
        process: ['Strategic Discovery', 'Architecture Blueprinting', 'Engineering Phase', 'Intelligence Integration', 'Deployment & Scale']
    },
    'digital-growth': {
        title: 'Digital Growth',
        tagline: 'Market Dominance Strategy',
        description: 'Strategic branding and search engine engineering that positions your business at the apex of its niche. We don\'t drive traffic; we capture high-value market share.',
        icon: Zap,
        features: [
            {
                title: 'SEO Engineering',
                desc: 'Technical search optimization that bypasses competition and secures ranking authority.',
                icon: Zap
            },
            {
                title: 'Brand Identity',
                desc: 'Premium visual languages that communicate credibility and authority instantly.',
                icon: Shield
            },
            {
                title: 'Lead Acquisition',
                desc: 'Strategic funnels designed to convert global interest into qualified bookings.',
                icon: ArrowRight
            }
        ],
        process: ['Niche Analysis', 'Visual Archetype Design', 'Content Strategy', 'Traffic Engineering', 'Conversion Optimization']
    },
    'device-repairs': {
        title: 'Device Repairs',
        tagline: 'Industrial Hardware Mastery',
        description: 'Specialized hardware servicing and restoration since 2014. From board-level microsoldering to complex system recovery, we restore continuity.',
        icon: Wrench,
        features: [
            {
                title: 'Microsoldering',
                desc: 'Component-level motherboard repair with microscopic precision.',
                icon: Cpu
            },
            {
                title: 'Mobile Forensics',
                desc: 'Complex data recovery and system restoration for modern mobile devices.',
                icon: Wrench
            },
            {
                title: 'Mac/PC Servicing',
                desc: 'High-end servicing and optimization for professional computing hardware.',
                icon: Shield
            }
        ],
        process: ['Diagnostic Entry', 'Technical Proposal', 'Hardware Execution', 'Stress Testing', 'Quality Certification']
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
                {/* Hero Section - Asymmetric Alignment */}
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
                                {data.title.split(' & ')[0]} <br />
                                <span className="text-primary italic font-secondary tracking-normal">& {data.title.split(' & ')[1]}</span>
                            </h1>
                            <p className="text-scale-2 md:text-scale-3 text-muted-foreground font-medium leading-relaxed max-w-2xl font-secondary italic">
                                {data.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Button asChild size="lg" className="h-14 px-10 text-[10px] font-bold uppercase tracking-widest bg-primary rounded-none transition-all duration-700">
                                <Link href="/booking">Initiate Project</Link>
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

                {/* Features Grid - Asymmetric Grid */}
                <div className="grid md:grid-cols-3 gap-px bg-border mb-v-4">
                    {data.features.map((feature, i) => (
                        <div key={i} className="bg-background p-12 md:p-16 space-y-8 hover:bg-card transition-colors duration-700 group">
                            <feature.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-700" />
                            <div className="space-y-4">
                                <h4 className="text-scale-2 font-bold tracking-tight uppercase">{feature.title}</h4>
                                <p className="text-scale-1 text-muted-foreground font-medium leading-relaxed font-secondary italic">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Process Roadmap */}
                <div className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-scale-3 font-bold uppercase tracking-[0.3em]">Execution Blueprint</h2>
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
                            <Link href="/booking">Initiate Strategy Session</Link>
                        </Button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] border border-primary/5 rounded-full -z-10 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
