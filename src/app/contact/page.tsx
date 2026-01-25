'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-48">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl space-y-8 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em]"
          >
            <span>Direct Acquisition</span>
          </motion.div>
          <h1 className="font-headline text-6xl md:text-9xl font-bold tracking-tighter leading-none">
            SECURE <br />
            <span className="text-primary italic">CHANNEL.</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-px bg-border/50 border border-border/50">
          {/* Direct Contact Info */}
          <div className="lg:col-span-5 bg-background p-12 md:p-16 space-y-16">
            {[
              { icon: MapPin, title: 'Operational HQ', value: 'Harare, Zimbabwe' },
              { icon: Phone, title: 'Direct Line', value: '+263 718 704 505' },
              { icon: Mail, title: 'Encrypted Email', value: 'strive@s-tech.co.zw' }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </div>
                <p className="text-2xl font-bold tracking-tight">{item.value}</p>
              </div>
            ))}

            <div className="pt-8 border-t border-border/50">
              <Link href="https://wa.me/263718704505" className="group flex items-center justify-between text-xs font-bold uppercase tracking-[0.3em] hover:text-primary transition-colors">
                Immediate WhatsApp Access
                <MessageSquare className="h-6 w-6 -rotate-12 group-hover:rotate-0 transition-transform" />
              </Link>
            </div>
          </div>

          {/* High-End Contact Form */}
          <div className="lg:col-span-7 bg-background p-12 md:p-16 space-y-12 border-l border-border/50">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Identification</Label>
                <Input className="h-16 bg-secondary/5 rounded-none border-border/50 font-medium placeholder:opacity-20" placeholder="NAME / ORGANIZATION" />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Routing</Label>
                <Input className="h-16 bg-secondary/5 rounded-none border-border/50 font-medium placeholder:opacity-20" placeholder="EMAIL ADDRESS" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">The Brief</Label>
              <Textarea className="min-h-[200px] bg-secondary/5 rounded-none border-border/50 font-medium p-8 placeholder:opacity-20" placeholder="DESCRIBE YOUR CHALLENGE OR REQUIREMENT" />
            </div>

            <Button className="w-full h-20 text-xl font-bold uppercase tracking-[0.2em] bg-primary group">
              Transmit Briefing
              <ArrowUpRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
