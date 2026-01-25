'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Wrench, Shield, Zap, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden font-primary selection:bg-primary/20">
      {/* Strategic Hero - Asymmetric Architecture */}
      <section className="relative min-h-[85vh] flex items-center pt-v-4 border-b border-border">
        <div className="container mx-auto px-v-1 grid lg:grid-cols-12 gap-v-3 items-end">
          <motion.div
            className="lg:col-span-8 space-y-v-2 pb-v-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
              <span className="h-1.5 w-1.5 bg-accent animate-pulse" />
              Operational Since 2014
            </div>

            <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tight leading-[0.95] max-w-4xl">
              Systems Engineering <br />
              <span className="text-secondary italic font-secondary tracking-normal">for the Digital Age.</span>
            </h1>

            <p className="max-w-2xl text-scale-2 md:text-scale-3 text-muted-foreground font-medium leading-relaxed font-secondary">
              We architect high-availability digital infrastructures. From component-level hardware diagnostics to macroscopic AI integration, our methodology is inherently precise and chromatically neutral.
            </p>

            <div className="flex flex-col sm:flex-row gap-v-2 pt-v-1">
              <Button asChild size="lg" className="h-14 px-8 text-scale-1 font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none transition-all duration-500">
                <Link href="/services">
                  Review Capabilities <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-scale-1 font-bold uppercase tracking-widest border border-border/50 hover:bg-secondary/5 rounded-none transition-all duration-500">
                <Link href="/portfolio">Review Proof</Link>
              </Button>
            </div>
          </motion.div>

          {/* Asymmetric Offset Element */}
          <div className="hidden lg:block lg:col-span-4 self-start pt-v-3 translate-x-12">
            <div className="aspect-[3/4] border-l border-t border-border bg-card p-10 space-y-12">
              <div className="h-px w-12 bg-primary" />
              <div className="space-y-4">
                <h3 className="text-scale-3 font-bold uppercase tracking-tight">Mission Intent</h3>
                <p className="text-scale-1 font-medium text-muted-foreground font-secondary italic">
                  "Precision is not an act, but a habit. We bridge the gap between microscopic failure and macroscopic success."
                </p>
              </div>
              <div className="pt-8">
                <Shield className="h-12 w-12 text-primary opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome-Oriented Service Splits - Asymmetric Grid */}
      <section className="py-v-4">
        <div className="container mx-auto px-v-1">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border leading-none">
            {[
              {
                title: "Software & Systems",
                desc: "Deterministic architectures for sensitive operations and high-scale intelligence.",
                icon: Globe,
                href: "/services/software-systems",
                label: "Systems"
              },
              {
                title: "Digital Growth",
                desc: "Strategic lead acquisition through precision SEO and brand authority.",
                icon: Zap,
                href: "/services/digital-growth",
                label: "Brands"
              },
              {
                title: "Hardware Lifecycle",
                desc: "Industrial restoration and component-level analysis for mission-critical gadgets.",
                icon: Wrench,
                href: "/services/device-repairs",
                label: "Hardware"
              }
            ].map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className="group relative bg-background p-12 md:p-16 space-y-v-2 transition-colors hover:bg-card border-b border-border md:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <service.icon className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-700" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30">0{i + 1}</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-scale-3 font-bold tracking-tight uppercase">{service.title}</h2>
                  <p className="text-scale-1 text-muted-foreground font-medium leading-relaxed font-secondary italic">{service.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700 text-primary">
                  Access {service.label} Module <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Layer - Long Form Serif Focus */}
      <section className="py-v-4 bg-muted/10 border-t border-border">
        <div className="container mx-auto px-v-1">
          <div className="flex flex-col lg:flex-row gap-v-4 items-center">
            <div className="lg:w-7/12 space-y-v-2">
              <h2 className="text-scale-4 font-bold tracking-tight leading-none uppercase">
                Over a Decade of <br />
                <span className="text-primary italic font-secondary tracking-normal">Technical Honesty.</span>
              </h2>
              <p className="text-scale-2 font-secondary font-medium text-muted-foreground leading-relaxed max-w-2xl">
                Since October 2014, S-Tech Solutions has occupied the narrow intersection between hardware repair and software innovation. Our methodology is not trendy; it is proven. We serve the local Harare market with physical precision and the global market with architectural intelligence.
              </p>
              <div className="pt-v-1">
                <Button asChild variant="outline" className="h-14 px-8 text-[10px] font-bold uppercase tracking-[0.3em] rounded-none">
                  <Link href="/about">Access History</Link>
                </Button>
              </div>
            </div>

            <div className="lg:w-5/12 relative group">
              <div className="aspect-square bg-card border border-border p-12 flex flex-col justify-between">
                <Star className="h-10 w-10 text-accent opacity-20 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="space-y-6">
                  <p className="text-scale-2 font-secondary italic font-medium leading-relaxed">
                    "Unmatched combined expertise. Detailed, honest, and technically superior in both gadget restoration and system design."
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Core Testimony: David C.</p>
                </div>
              </div>
              <div className="absolute -inset-4 border border-primary/10 -z-10 group-hover:scale-105 transition-transform duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Final Transmission CTA */}
      <section className="py-v-5 bg-background border-t border-border relative overflow-hidden">
        <div className="container mx-auto px-v-1 text-center space-y-v-3 relative z-10">
          <h2 className="text-scale-5 font-bold tracking-tighter leading-[0.85] uppercase">
            Initiate <br />
            <span className="text-primary italic font-secondary tracking-normal">Upgrade.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-v-2">
            <Button asChild size="lg" className="h-20 px-12 text-scale-2 font-bold uppercase tracking-widest bg-primary rounded-none hover:bg-primary/90 transition-all duration-700">
              <Link href="/booking">Book Strategy Session</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 px-12 text-scale-2 font-bold uppercase tracking-widest border-border hover:bg-muted/10 rounded-none transition-all duration-700">
              <Link href="/contact">Message Support</Link>
            </Button>
          </div>
        </div>

        {/* Background Bias Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full -z-10 animate-pulse" />
      </section>
    </div>
  );
}
