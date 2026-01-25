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
        <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
            <div className="container mx-auto px-v-1">
                {/* Header Section */}
                <div className="max-w-4xl space-y-8 mb-v-4">
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em]"
                    >
                        <span>The Efficiency Catalog</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-none uppercase"
                    >
                        Services as <br />
                        <span className="text-primary italic font-secondary tracking-normal">Engineering.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-scale-2 text-muted-foreground font-medium max-w-2xl leading-relaxed font-secondary italic"
                    >
                        We don't sell hours; we sell architectural certainty. Our services are stratified into three primary engineering modules.
                    </motion.p>
                </div>

                {/* Services List - Asymmetric Stack */}
                <div className="space-y-v-3">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative grid lg:grid-cols-12 gap-px bg-border overflow-hidden"
                        >
                            <div className="lg:col-span-1 p-8 md:p-12 flex justify-center items-start bg-background border-r border-border">
                                <span className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground/30 vertical-text">0{i + 1}</span>
                            </div>

                            <div className="lg:col-span-7 p-12 md:p-16 bg-background space-y-12">
                                <div className="space-y-4">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">{service.subtitle}</div>
                                    <h2 className="text-scale-3 md:text-scale-4 font-bold tracking-tight uppercase leading-none">{service.title}</h2>
                                    <p className="text-scale-2 text-muted-foreground font-medium leading-relaxed max-w-xl font-secondary italic">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <ul className="space-y-4">
                                        {service.outcomes.map((outcome, j) => (
                                            <li key={j} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-foreground/70">
                                                <span className="h-1 w-1 bg-accent" />
                                                {outcome}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-end justify-end">
                                        <Button asChild className="h-12 px-8 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none transition-all duration-700 group">
                                            <Link href={`/services/${service.id}`} className="flex items-center">
                                                Deep Dive <ArrowRight className="ml-3 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 bg-muted/5 relative overflow-hidden hidden lg:block">
                                <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-15 transition-opacity duration-1000">
                                    <service.icon className="h-64 w-64" />
                                </div>
                                <div className="absolute bottom-12 right-12">
                                    <service.icon className="h-20 w-20 text-primary/10" />
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
