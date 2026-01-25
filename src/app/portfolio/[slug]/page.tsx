'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, Zap, Globe, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CaseStudyPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="min-h-screen bg-background pt-32 pb-48">
            <div className="container mx-auto px-4">
                {/* Navigation Breadcrumb */}
                <Link href="/portfolio" className="group inline-flex items-center gap-2 mb-12 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Portfolio
                </Link>

                {/* Title Section */}
                <div className="max-w-6xl grid lg:grid-cols-12 gap-16 mb-32 items-end">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex gap-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Case Study</span>
                            <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">Q4 2025</span>
                        </div>
                        <h1 className="font-headline text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85]">
                            {slug.split('-').join(' ').toUpperCase()}
                        </h1>
                    </div>

                    <div className="lg:col-span-4 space-y-6 lg:pb-4 border-l border-border/50 pl-8">
                        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">Core Objective</p>
                        <p className="text-xl font-medium italic text-muted-foreground">
                            "Transforming legacy constraints into modern operational leverage."
                        </p>
                    </div>
                </div>

                {/* Narrative Section - Problem/Solution/Result */}
                <div className="grid lg:grid-cols-12 gap-px bg-border/50 border border-border/50">
                    {[
                        {
                            id: '01',
                            title: 'The Challenge',
                            desc: 'Initial analysis revealed significant architectural friction and data siloing, preventing real-time decision making and scaling.',
                            icon: Shield
                        },
                        {
                            id: '02',
                            title: 'The Engineering',
                            desc: 'We implemented a bespoke AI-integrated core and refactored the data lifecycle to support low-latency global operations.',
                            icon: Zap
                        },
                        {
                            id: '03',
                            title: 'The Result',
                            desc: '40% reduction in operational overhead and a 200% increase in qualified lead conversion within the first quarter post-deployment.',
                            icon: Globe
                        }
                    ].map((phase) => (
                        <div key={phase.id} className="lg:col-span-4 bg-background p-12 md:p-16 space-y-12">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.5em] text-muted-foreground/40">
                                <span>Phase {phase.id}</span>
                                <phase.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-6">
                                <h3 className="font-headline text-4xl font-bold tracking-tight uppercase">{phase.title}</h3>
                                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                    {phase.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                <div className="mt-32 p-16 md:p-32 border border-border/50 bg-secondary/5 text-center space-y-12">
                    <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                        ACHIEVE SIMILAR <br />
                        <span className="text-primary italic">VELOCITY.</span>
                    </h2>
                    <Button asChild size="lg" className="h-20 px-16 text-xl font-bold uppercase tracking-tighter bg-primary">
                        <Link href="/booking">Initiate Your Project</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
