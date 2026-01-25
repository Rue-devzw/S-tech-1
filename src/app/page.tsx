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
    <div className="flex flex-col overflow-hidden">
      {/* Strategic Hero - Asymmetric & Motion Driven */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            className="lg:col-span-7 space-y-8 z-10"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em]">
              <Zap className="h-3 w-3 fill-primary" />
              <span>Engineered to Lead Since 2014</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]">
              ELITE <br />
              <span className="text-primary italic">ENGINEERING.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
              We bridge the gap between microscopic hardware precision and macroscopic software intelligence. Global software. Local hardware. Infinite solutions.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button asChild size="lg" className="h-16 px-10 text-lg font-bold uppercase tracking-widest bg-primary hover:bg-primary/90">
                <Link href="/services">
                  Explore Services <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-bold uppercase tracking-widest border-2">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
              <div className="relative h-full w-full border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden p-8 flex flex-col justify-end">
                <div className="absolute top-0 right-0 p-12 opacity-20">
                  <Cpu className="h-48 w-48 text-primary" />
                </div>
                <div className="space-y-4">
                  <div className="h-1 w-24 bg-primary" />
                  <h3 className="font-headline text-4xl font-bold tracking-tight">PRECISION <br />HARDWARE.</h3>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Component-Level Mastery</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Background Visual elements */}
        <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-primary/5 blur-[150px] -z-10" />
        <div className="absolute -bottom-1/2 -left-1/4 w-1/2 h-full bg-secondary/5 blur-[150px] -z-10" />
      </section>

      {/* Outcome-Oriented Splits */}
      <section className="py-32 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-px bg-border/50 border border-border/50 leading-none">
            {[
              {
                title: "Software & AI",
                desc: "High-performance systems built for conversion and scale.",
                icon: Globe,
                href: "/services/software-systems",
                label: "Systems"
              },
              {
                title: "Digital Growth",
                desc: "Strategic branding and SEO that captures market share.",
                icon: Zap,
                href: "/services/digital-growth",
                label: "Brands"
              },
              {
                title: "Device Repairs",
                desc: "Expert hardware servicing with industrial-grade precision.",
                icon: Wrench,
                href: "/services/device-repairs",
                label: "Hardware"
              }
            ].map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className="group relative bg-background p-12 md:p-16 space-y-8 transition-colors hover:bg-primary"
              >
                <div className="flex justify-between items-start">
                  <service.icon className="h-12 w-12 text-primary group-hover:text-background transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground group-hover:text-background/60">0{i + 1}</span>
                </div>
                <div className="space-y-4">
                  <h2 className="font-headline text-3xl font-bold tracking-tight group-hover:text-background">{service.title}</h2>
                  <p className="text-muted-foreground group-hover:text-background/80 font-medium leading-relaxed">{service.desc}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-background">
                  Explore {service.label} <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Credibility - Non-Generic */}
      <section className="py-32 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-24 items-end">
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <h2 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-none">
                  OVER A DECADE OF <br />
                  <span className="text-primary italic">ACCURACY.</span>
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <h4 className="font-bold uppercase tracking-wider">Trusted Authority</h4>
                  <p className="text-muted-foreground font-medium">Serving Harare and the global market since October 2014 with unshakeable integrity.</p>
                </div>
                <div className="space-y-4">
                  <Star className="h-8 w-8 text-primary" />
                  <h4 className="font-bold uppercase tracking-wider">Elite Execution</h4>
                  <p className="text-muted-foreground font-medium">We don't just solve problems; we engineer outcomes that drive revenue.</p>
                </div>
              </div>

              <Button asChild variant="link" className="text-primary p-0 text-xl font-bold uppercase tracking-widest h-auto">
                <Link href="/about" className="flex items-center">
                  Learn Our Story <ArrowRight className="ml-4 h-6 w-6" />
                </Link>
              </Button>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/5] bg-border/20 border border-border/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <div className="absolute bottom-12 left-12 right-12 z-20 space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <p className="font-headline text-3xl font-bold leading-tight uppercase">
                    "Reliable and trustworthy. Strive is the only person I trust with my gadgets."
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.5em] text-primary">David C., Harare</p>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 h-64 w-64 border border-primary/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 bg-primary">
        <div className="container mx-auto px-4 text-center space-y-12">
          <h2 className="font-headline text-6xl md:text-9xl font-bold tracking-tighter text-background leading-none">
            READY TO <br />
            UPGRADE?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-background/90 h-20 px-12 text-2xl font-bold uppercase tracking-tighter">
              <Link href="/booking">Book a Strategy Call</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-primary h-20 px-12 text-2xl font-bold uppercase tracking-tighter">
              <Link href="/contact">Message Support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

