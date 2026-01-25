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
        <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
            <div className="container mx-auto px-v-1">
                {/* Navigation Breadcrumb */}
                <Link href="/portfolio" className="group inline-flex items-center gap-4 mb-v-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors duration-500">
                    <ArrowLeft className="h-4 w-4 transition-transform duration-700 group-hover:-translate-x-2" />
                    Back to Index
                </Link>

                {/* Title Section - Asymmetric Grid */}
                <div className="max-w-6xl grid lg:grid-cols-12 gap-v-3 mb-v-4 items-end">
                    <div className="lg:col-span-9 space-y-8">
                        <div className="flex gap-4">
                            <span className="px-3 py-1 bg-primary/5 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Operational Record</span>
                            <span className="px-3 py-1 bg-muted/20 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] font-secondary italic">Q4 2025</span>
                        </div>
                        <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-[0.85] uppercase">
                            {slug.split('-').join(' ')}
                        </h1>
                    </div>

                    <div className="lg:col-span-3 space-y-6 pb-4 border-l border-border pl-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Mission Brief</p>
                        <p className="text-scale-2 font-medium italic text-muted-foreground font-secondary leading-relaxed">
                            "Bridging the structural gap between legacy infrastructure and AI-driven capability."
                        </p>
                    </div>
                </div>

                {/* Narrative Section - Problem/Solution/Result - Serif Focus */}
                <div className="grid lg:grid-cols-12 gap-px bg-border">
                    {[
                        {
                            id: '01',
                            title: 'The Friction',
                            desc: 'Initial analysis revealed significant architectural drag and component-level entropy, preventing real-time mission execution.',
                            icon: Shield
                        },
                        {
                            id: '02',
                            title: 'The Solution',
                            desc: 'We implemented a deterministic core using the S-Tech methodology, refactoring the data lifecycle for global scale.',
                            icon: Zap
                        },
                        {
                            id: '03',
                            title: 'The Outcome',
                            desc: '40% overhead reduction and a 200% increase in operational velocity within the first protocol phase.',
                            icon: Globe
                        }
                    ].map((phase, i) => (
                        <div key={phase.id} className="lg:col-span-4 bg-background p-12 md:p-16 space-y-12 group hover:bg-card transition-colors duration-700">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/30 group-hover:text-primary transition-colors">
                                <span>Protocol {phase.id}</span>
                                <phase.icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-scale-3 font-bold tracking-tight uppercase leading-none">{phase.title}</h3>
                                <p className="text-scale-2 text-muted-foreground font-medium leading-relaxed font-secondary italic">
                                    {phase.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final CTA - Asymmetric Spacing */}
                <div className="mt-v-4 p-16 md:p-32 bg-card border border-border text-center space-y-12">
                    <h2 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-none uppercase">
                        Achieve <br />
                        <span className="text-primary italic font-secondary tracking-normal">Superiority.</span>
                    </h2>
                    <Button asChild size="lg" className="h-20 px-16 text-scale-2 font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none transition-all duration-700">
                        <Link href="/booking">Initiate Strategy Session</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
