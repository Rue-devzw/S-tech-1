'use client';

import { motion } from 'framer-motion';
import { Shield, Target, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-48">
      <div className="container mx-auto px-4">
        {/* Narrative Header */}
        <div className="max-w-5xl space-y-12 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em]"
          >
            <span>The History of S-Tech</span>
          </motion.div>
          <h1 className="font-headline text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85]">
            PRECISION <br />
            <span className="text-primary italic">SINCE 2014.</span>
          </h1>
          <p className="text-2xl text-muted-foreground font-medium leading-relaxed max-w-3xl">
            Founded on the principles of unshakeable integrity and technical obsession, S-Tech Solutions has evolved from a specialist hardware lab into a global software and systems powerhouse.
          </p>
        </div>

        {/* The Evolution Grid */}
        <div className="grid lg:grid-cols-2 gap-px bg-border/50 border border-border/50 mb-32">
          <div className="bg-background p-12 md:p-16 space-y-8">
            <h2 className="font-headline text-4xl font-bold uppercase tracking-tight">Our Philosophy</h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              We believe that modern software is only as good as the understanding of the hardware it runs on. Our foundational expertise in component-level repair gives us a unique advantage in complex systems engineering.
            </p>
          </div>
          <div className="bg-background p-12 md:p-16 space-y-8 border-l border-border/50">
            <h2 className="font-headline text-4xl font-bold uppercase tracking-tight">The Mission</h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              To empower visionary organizations with the technical leverage required to lead their industries. We don't just solve problems; we engineer superiority.
            </p>
          </div>
        </div>

        {/* Pillars of Authority */}
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: Shield, title: 'Integrity', desc: 'A decade of service built on absolute transparency and technical honesty.' },
            { icon: Target, title: 'Precision', desc: 'From microsoldering to high-scale cloud architecture; accuracy is our baseline.' },
            { icon: Award, title: 'Excellence', desc: 'A relentless commitment to pushing the boundaries of what is technically possible.' }
          ].map((pillar, i) => (
            <div key={i} className="p-12 border border-border/50 bg-secondary/5 space-y-6 text-center">
              <pillar.icon className="h-10 w-10 text-primary mx-auto" />
              <h4 className="font-bold uppercase tracking-[0.3em]">{pillar.title}</h4>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="mt-32 text-center space-y-8">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-primary">Ready to transcend?</p>
          <Button asChild size="lg" className="h-20 px-16 text-xl font-bold uppercase tracking-tighter bg-primary">
            <Link href="/contact">Direct Channel Access</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
