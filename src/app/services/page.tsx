'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Wrench, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const services = [
    {
        id: 'software-systems',
        title: 'Software & Systems',
        subtitle: 'Digital Infrastructure',
        description: 'We build high-performance, AI-vetted web applications and automated systems that transform operational efficiency into competitive advantage.',
        icon: Cpu,
        outcomes: ['AI-Powered Automation', 'Scalable Web Architectures', 'Legacy System Modernization'],
        color: 'bg-primary'
    },
    {
        id: 'digital-growth',
        title: 'Digital Growth',
        subtitle: 'Brand Acceleration',
        description: 'Strategic branding and SEO engineering designed to capture market share and convert high-intent leads into loyal advocates.',
        icon: Zap,
        outcomes: ['Precision SEO Engineering', 'Strategic Digital Branding', 'Conversion Rate Optimization'],
        color: 'bg-accent'
    },
    {
        id: 'device-repairs',
        title: 'Device Repairs',
        subtitle: 'Hardware Lifecycle',
        description: 'Industrial-grade hardware servicing for computers and mobile devices. We restore operational continuity through component-level mastery.',
        icon: Wrench,
        outcomes: ['Component-Level Repairs', 'Hardware Logistics & Servicing', 'System Flashing & Unlocking'],
        color: 'bg-foreground'
    }
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-48">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="max-w-4xl space-y-8 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        <span>The Outcome Catalog</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none"
                    >
                        SERVICES AS <br />
                        <span className="text-primary italic">SOLUTIONS.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed"
                    >
                        We don't sell hours; we sell outcomes. Our service architecture is designed to address specific business and technical challenges with absolute precision.
                    </motion.p>
                </div>

                {/* Services List */}
                <div className="space-y-12">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="group relative grid lg:grid-cols-12 gap-px bg-border/50 border border-border/50 overflow-hidden"
                        >
                            <div className="lg:col-span-1 p-8 md:p-12 flex justify-center items-start bg-background border-r border-border/50">
                                <span className="text-sm font-bold tracking-[0.4em] text-muted-foreground vertical-text">0{i + 1}</span>
                            </div>

                            <div className="lg:col-span-7 p-12 md:p-16 bg-background space-y-12">
                                <div className="space-y-4">
                                    <div className="text-xs font-bold uppercase tracking-[0.4em] text-primary">{service.subtitle}</div>
                                    <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">{service.title}</h2>
                                    <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <ul className="space-y-4">
                                        {service.outcomes.map((outcome, j) => (
                                            <li key={j} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-foreground/80">
                                                <ChevronRight className="h-4 w-4 text-primary" />
                                                {outcome}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-end justify-end">
                                        <Button asChild size="lg" className="h-16 px-10 text-xs font-bold uppercase tracking-widest bg-primary hover:bg-primary/90">
                                            <Link href={`/services/${service.id}`}>
                                                Deep Dive <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 bg-secondary/5 relative overflow-hidden hidden lg:block">
                                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                                    <service.icon className="h-64 w-64" />
                                </div>
                                <div className="absolute bottom-12 right-12">
                                    <service.icon className="h-24 w-24 text-primary/40" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
        </div>
    );
}
