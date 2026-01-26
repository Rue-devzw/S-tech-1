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
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-nav border-b border-border overflow-hidden">
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

            <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tight leading-[0.95] max-w-4xl uppercase">
              Engineering Intelligent Digital Systems — <br />
              <span className="text-secondary italic font-secondary tracking-normal lowercase">and Keeping Your Technology Working</span>
            </h1>

            <p className="max-w-2xl text-scale-2 md:text-scale-3 text-muted-foreground font-medium leading-relaxed font-secondary">
              We bridge the gap between complex engineering and business growth. S-Tech Solutions delivers AI-assisted software and professional device repairs—built for reliability, designed for results.
            </p>

            <div className="flex flex-col sm:flex-row gap-v-2 pt-v-1">
              <Button asChild size="lg" className="h-14 px-8 text-scale-1 font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none transition-all duration-500">
                <Link href="/booking?service=development">
                  Book a Consultation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-scale-1 font-bold uppercase tracking-widest border border-border/50 hover:bg-secondary/5 rounded-none transition-all duration-500">
                <Link href="/contact?service=repairs">Request a Repair Quote</Link>
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

      {/* Service Divisions Section */}
      <section className="py-v-4">
        <div className="container mx-auto px-v-1">
          <div className="mb-v-2">
            <h2 className="text-scale-3 font-bold uppercase tracking-widest text-muted-foreground/50 mb-4">Division Architectures</h2>
            <p className="text-scale-4 font-bold tracking-tighter uppercase leading-none">What We Build, Maintain, and Improve</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border leading-none">
            {[
              {
                title: "Software & Digital Systems Engineering",
                href: "/services/software-systems",
                label: "Explore Software Solutions →"
              },
              {
                title: "Digital Branding, Design & Growth",
                href: "/services/digital-growth",
                label: "View Digital Growth Services →"
              },
              {
                title: "Device & Computer Repair Services",
                href: "/services/device-repairs",
                label: "Get Repair Support →"
              },
              {
                title: "Digital Products & Tools",
                href: "/products",
                label: "Browse Products →"
              }
            ].map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className="group relative bg-background p-12 space-y-v-3 transition-all hover:bg-card border-b border-border lg:border-b-0 hover:z-10 hover:shadow-2xl"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30">Division 0{i + 1}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-scale-2 font-bold tracking-tight uppercase">{service.title}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium lowercase italic">Professional grade solutions for complex technical needs.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors duration-500">
                  {service.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-v-4 bg-muted/5 border-y border-border">
        <div className="container mx-auto px-v-1">
          <div className="grid lg:grid-cols-2 gap-v-4 items-center">
            <div className="space-y-v-2">
              <h2 className="text-scale-4 font-bold tracking-tighter uppercase leading-none">
                Why Clients Choose <br />
                <span className="text-primary italic font-secondary tracking-normal lowercase">S-Tech Solutions</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-v-2">
              {[
                "Engineering-First Thinking",
                "AI-Assisted Development",
                "Dual Expertise",
                "Outcome-Driven Work"
              ].map((point, i) => (
                <motion.div
                  key={i}
                  className="p-8 border border-border bg-background"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                >
                  <span className="text-scale-2 font-bold tracking-tight uppercase">
                    {point.split(' ').map((word, j) => (
                      <span key={j} className={j === 0 ? "text-primary" : ""}>{word} </span>
                    ))}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio Section */}
      <section className="py-v-4">
        <div className="container mx-auto px-v-1">
          <div className="flex justify-between items-end mb-v-3">
            <div className="space-y-4">
              <h2 className="text-scale-4 font-bold tracking-tighter uppercase leading-none">Selected Work</h2>
              <div className="h-px w-24 bg-primary" />
            </div>
            <Link href="/portfolio" className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">
              Access Full Archive →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-v-3">
            {[
              {
                name: "Neural Commerce Engine",
                problem: "Fragmented retail logistics requiring autonomous inventory synchronization.",
                category: "Systems & Automation"
              },
              {
                name: "Aero-Restoration Hub",
                problem: "Precision component failure in high-frequency mobile hardware.",
                category: "Hardware Repairs"
              }
            ].map((project, i) => (
              <div key={i} className="group border border-border bg-card overflow-hidden">
                <div className="aspect-video bg-muted/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">
                    <Cpu className="w-24 h-24 text-primary/20" />
                  </div>
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-background text-[10px] font-bold uppercase tracking-widest border border-border">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 space-y-6">
                  <h3 className="text-scale-3 font-bold uppercase tracking-tight">{project.name}</h3>
                  <p className="text-scale-1 text-muted-foreground font-medium font-secondary italic leading-relaxed">
                    {project.problem}
                  </p>
                  <Button asChild variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent">
                    <Link href={`/portfolio/${i}`}>View Case Study →</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Transmission CTA */}
      <section className="py-v-5 bg-background border-t border-border relative overflow-hidden">
        <div className="container mx-auto px-v-1 text-center space-y-v-3 relative z-10">
          <h2 className="text-scale-5 font-bold tracking-tighter leading-[0.85] uppercase">
            Initiate <br />
            <span className="text-primary italic font-secondary tracking-normal lowercase">Upgrade.</span>
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-v-2">
            <Button asChild size="lg" className="h-20 px-12 text-scale-2 font-bold uppercase tracking-widest bg-primary rounded-none hover:bg-primary/90 transition-all duration-700">
              <Link href="/booking">Book a Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-20 px-12 text-scale-2 font-bold uppercase tracking-widest border-border hover:bg-muted/10 rounded-none transition-all duration-700">
              <Link href="/contact">Request a Repair Quote</Link>
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
