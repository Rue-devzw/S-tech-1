'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const categories = ['All', 'Web & Apps', 'Systems & Automation', 'Design', 'Repairs'];

const projects = [
  {
    title: 'Mussy Consultancy Agency',
    category: 'Web & Apps',
    slug: 'mussy-consultancy-agency',
    description: 'A strategic digital gateway for global education consultancy, architected to facilitate seamless student journeys through complex international application landscapes.',
    image: '/images/dev-project-1.webp',
    tags: ['Next.js', 'Education', 'Strategy']
  },
  {
    title: 'Valley Farm Secrets',
    category: 'Web & Apps',
    slug: 'valley-farm-secrets',
    description: 'An integrated farm-to-table digital marketplace optimizing sustainable supply chains and connecting local Zimbabwean producers directly to the consumer collective.',
    image: '/images/dev-project-2.webp',
    tags: ['E-commerce', 'Agriculture', 'Logistics']
  },
  {
    title: 'S-Tech Solutions',
    category: 'Web & Apps',
    slug: 's-tech-solutions',
    description: 'A high-precision engineering platform bridging the gap between hardware reliability and advanced AI-assisted software systems for mission-critical operations.',
    image: '/images/dev-project-3.webp',
    tags: ['Engineering', 'AI', 'Full-stack']
  }
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
      <div className="container mx-auto px-v-1">
        <div className="max-w-4xl space-y-8 mb-v-3">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            <span>Proof of Competence</span>
          </motion.div>
          <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-none uppercase">
            Proven <br />
            <span className="text-primary italic font-secondary tracking-normal">Engineering.</span>
          </h1>
        </div>

        {/* Category Filter - Asymmetric spacing */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-border pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500",
                activeCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid - Asymmetric Grid Patterns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-background p-12 space-y-12 hover:bg-card transition-colors duration-700"
            >
              <div className="aspect-[4/3] bg-muted/5 border border-border/50 relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-1000" />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{project.category}</span>
                  <ArrowRight className="h-5 w-5 -rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-0 text-accent" />
                </div>
                <h3 className="text-scale-3 font-bold tracking-tight leading-tight uppercase">{project.title}</h3>
                <p className="text-scale-1 text-muted-foreground font-medium line-clamp-2 font-secondary italic">{project.description}</p>
              </div>

              <Link href={`/portfolio/${project.slug}`} className="absolute inset-0 z-20">
                <span className="sr-only">Access Case Study</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
