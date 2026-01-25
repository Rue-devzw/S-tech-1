'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/icons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
      <div className="container mx-auto px-v-1">
        {/* Story Section - Asymmetric Grid */}
        <div className="grid lg:grid-cols-12 gap-v-4 items-end mb-v-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 space-y-12"
          >
            <div className="space-y-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">A Decade of Intelligence</div>
              <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-[0.85] uppercase">
                Architecting <br />
                <span className="text-secondary italic font-secondary tracking-normal">Proprietary Value.</span>
              </h1>
              <p className="max-w-2xl text-scale-2 md:text-scale-3 font-secondary font-medium italic text-muted-foreground leading-relaxed">
                Founded in October 2014, S-Tech Solutions functions as a specialized engineering hub. We occupy the narrow delta between industrial hardware reliability and digital system innovation.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-12 pt-8 border-t border-border">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">The Methodology</h4>
                <p className="text-scale-1 font-secondary italic text-muted-foreground leading-relaxed">We treat every gadget as a system and every system as an asset. Precision is our baseline protocol.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">The Vision</h4>
                <p className="text-scale-1 font-secondary italic text-muted-foreground leading-relaxed">To remain the primary technical authority in Harare while scaling digital solutions globally.</p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-4 aspect-[3/4] bg-card border border-border p-12 space-y-12 hidden lg:block translate-y-24">
            <div className="h-px w-12 bg-primary" />
            <div className="space-y-4">
              <h3 className="text-scale-2 font-bold uppercase tracking-widest">Operational Core</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Component-Level Mastery</p>
            </div>
            <div className="pt-24 opacity-5">
              <Logo className="h-48 w-48" />
            </div>
          </div>
        </div>

        {/* Values / Features Overlay */}
        <div className="grid md:grid-cols-3 gap-px bg-border mb-v-4">
          {[
            {
              title: 'Technical Honesty',
              desc: 'Deterministic diagnostics. No speculative repairs, only evidence-based engineering.',
              icon: Shield
            },
            {
              title: 'Velocity Hub',
              desc: 'Strategic execution cycles designed to minimize drag and maximize operational uptime.',
              icon: Zap
            },
            {
              title: 'Global Logic',
              desc: 'Architecting for international standards while serving the local Harare ecosystem.',
              icon: Globe
            }
          ].map((value, i) => (
            <div key={i} className="bg-background p-12 md:p-16 space-y-8 hover:bg-card transition-colors duration-700 group">
              <value.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-1000" />
              <div className="space-y-4">
                <h3 className="text-scale-2 font-bold tracking-tight uppercase">{value.title}</h3>
                <p className="text-scale-1 text-muted-foreground font-medium leading-relaxed font-secondary italic">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Final Statement */}
        <div className="py-v-4 border-t border-border mt-v-4">
          <div className="max-w-2xl space-y-8">
            <h2 className="text-scale-3 font-bold uppercase tracking-[0.3em]">The Commitment</h2>
            <p className="text-scale-2 font-secondary italic font-medium text-muted-foreground leading-relaxed">
              S-Tech Solutions is more than a service provider; we are a technical partner. We maintain a non-linear growth trajectory, constantly evolving our protocols to meet the entropy of modern technology.
            </p>
            <Button asChild className="h-14 px-8 text-[10px] font-bold uppercase tracking-[0.4em] bg-primary rounded-none transition-all duration-700">
              <Link href="/contact">Initiate Dialogue</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
