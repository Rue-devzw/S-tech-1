'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const categories = ['All', 'Software', 'Systems', 'Branding', 'Hardware'];

const projects = [
  {
    title: 'NexGen AI Dashboard',
    category: 'Software',
    slug: 'nexgen-ai-dashboard',
    description: 'A predictive analytics engine for fintech operations.',
    image: '/portfolio/nexgen.jpg',
    tags: ['Next.js', 'AI', 'Tailwind']
  },
  {
    title: 'Pulse Brand Identity',
    category: 'Branding',
    slug: 'pulse-brand-identity',
    description: 'Comprehensive visual overhaul for a modern logistics firm.',
    image: '/portfolio/pulse.jpg',
    tags: ['Design', 'Strategy']
  },
  {
    title: 'Core System Recovery',
    category: 'Hardware',
    slug: 'core-system-recovery',
    description: 'Board-level restoration of high-availability server clusters.',
    image: '/portfolio/hardware.jpg',
    tags: ['Repair', 'Logic Board']
  }
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pt-32 pb-48">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl space-y-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em]"
          >
            <span>The Proof of Excellence</span>
          </motion.div>
          <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none">
            REAL WORK. <br />
            <span className="text-primary italic">REAL RESULTS.</span>
          </h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-border/50 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] transition-all border border-transparent",
                activeCategory === cat ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground hover:border-border/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative bg-background p-12 space-y-12 hover:bg-secondary/5 transition-colors"
            >
              <div className="aspect-[4/3] bg-secondary/10 relative overflow-hidden">
                {/* Placeholder for real images */}
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-[0.5em] text-muted-foreground italic">
                  PREVIEW_SECURED
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{project.category}</span>
                  <ArrowRight className="h-5 w-5 -rotate-45 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-0" />
                </div>
                <h3 className="font-headline text-3xl font-bold tracking-tight leading-tight">{project.title}</h3>
                <p className="text-muted-foreground font-medium line-clamp-2">{project.description}</p>
              </div>

              <Link href={`/portfolio/${project.slug}`} className="absolute inset-0 z-20">
                <span className="sr-only">View Case Study</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
