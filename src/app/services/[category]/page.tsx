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

    if (!data) return <div className="pt-48 text-center font-headline text-2xl">404 | CATEGORY NOT FOUND</div>;

    return (
        <div className="min-h-screen bg-background pt-32 pb-48">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="grid lg:grid-cols-12 gap-16 items-start mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="text-xs font-bold uppercase tracking-[0.4em] text-primary">{data.tagline}</div>
                            <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
                                {data.title.split(' & ')[0]} <br />
                                <span className="text-primary italic">& {data.title.split(' & ')[1]}</span>
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                                {data.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Button asChild size="lg" className="h-16 px-12 text-xs font-bold uppercase tracking-[0.2em] bg-primary">
                                <Link href="/booking">Initiate Project</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-16 px-12 text-xs font-bold uppercase tracking-[0.2em] border-2">
                                <Link href="/portfolio">Review Capability</Link>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="lg:col-span-5 aspect-[4/5] bg-secondary/5 border border-border/50 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <data.icon className="h-64 w-64 text-primary" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-background to-transparent space-y-4">
                            <div className="h-1 w-24 bg-primary" />
                            <h3 className="font-headline text-3xl font-bold uppercase tracking-tight">MISSION <br />OBJECTIVE.</h3>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-px bg-border/50 border border-border/50 mb-32">
                    {data.features.map((feature, i) => (
                        <div key={i} className="bg-background p-12 space-y-8 hover:bg-secondary/5 transition-colors">
                            <feature.icon className="h-10 w-10 text-primary" />
                            <div className="space-y-4">
                                <h4 className="font-headline text-2xl font-bold tracking-tight uppercase">{feature.title}</h4>
                                <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Process Roadmap */}
                <div className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="font-headline text-4xl font-bold uppercase tracking-tight">EXECUTION ROADMAP</h2>
                        <div className="h-1 w-24 bg-primary mx-auto" />
                    </div>

                    <div className="grid md:grid-cols-5 gap-8">
                        {data.process.map((step, i) => (
                            <div key={i} className="relative p-8 border border-border/50 bg-secondary/5 space-y-6 text-center group overflow-hidden">
                                <div className="text-4xl font-bold text-primary opacity-20 group-hover:opacity-100 transition-opacity">0{i + 1}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em]">{step}</div>
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA Overlay */}
                <div className="mt-48 bg-primary p-16 md:p-32 text-center space-y-12 overflow-hidden relative">
                    <div className="relative z-10 space-y-6">
                        <h2 className="font-headline text-5xl md:text-8xl font-bold tracking-tighter text-background leading-none">
                            SECURE YOUR <br />OUTCOME.
                        </h2>
                        <p className="text-background/80 text-xl font-bold uppercase tracking-widest max-w-xl mx-auto">
                            Limited availability for Q1 projects.
                        </p>
                        <Button asChild size="lg" className="h-20 px-16 text-xl font-bold uppercase tracking-tighter bg-background text-primary hover:bg-background/90">
                            <Link href="/booking">Book Strategy Call</Link>
                        </Button>
                    </div>
                    <div className="absolute top-0 right-0 rotate-12 translate-x-1/4 -translate-y-1/4 opacity-10">
                        <data.icon className="h-[600px] w-[600px] text-background" />
                    </div>
                </div>
            </div>
        </div>
    );
}
