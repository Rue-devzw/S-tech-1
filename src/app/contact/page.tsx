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
    <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
      <div className="container mx-auto px-v-1">
        <div className="max-w-4xl space-y-8 mb-v-3">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            <span>Direct Acquisition</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-none uppercase"
          >
            Secure <br />
            <span className="text-secondary italic font-secondary tracking-normal">Channel.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-scale-2 text-muted-foreground font-medium max-w-2xl leading-relaxed font-secondary italic"
          >
            Encryption active. Transmit your briefing or request industrial support.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-px bg-border border border-border">
          {/* Direct Contact Info - Asymmetric Left */}
          <div className="lg:col-span-5 bg-background p-12 md:p-16 space-y-16">
            {[
              { icon: MapPin, title: 'Operational HQ', value: 'Harare, Zimbabwe' },
              { icon: Phone, title: 'Direct Line', value: '+263 718 704 505' },
              { icon: Mail, title: 'Encrypted Email', value: 'strive@s-tech.co.zw' }
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.4em]">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </div>
                <p className="text-scale-3 font-bold tracking-tight uppercase leading-none">{item.value}</p>
              </div>
            ))}

            <div className="pt-8 border-t border-border">
              <Link href="https://wa.me/263718704505" className="group flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.4em] hover:text-primary transition-colors duration-500">
                Immediate WhatsApp Access
                <MessageSquare className="h-6 w-6 -rotate-12 group-hover:rotate-0 transition-transform duration-700 text-accent" />
              </Link>
            </div>
          </div>

          {/* High-End Contact Form - Asymmetric Right */}
          <div className="lg:col-span-7 bg-card p-12 md:p-16 space-y-12 border-l border-border">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Identification</Label>
                <Input className="h-14 bg-background rounded-none border-border font-medium placeholder:opacity-20" placeholder="NAME / ORG" />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Routing</Label>
                <Input className="h-14 bg-background rounded-none border-border font-medium placeholder:opacity-20" placeholder="EMAIL ADDRESS" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">The Brief</Label>
              <Textarea className="min-h-[200px] bg-background rounded-none border-border font-medium p-8 placeholder:opacity-20" placeholder="DESCRIBE MISSION" />
            </div>

            <Button className="w-full h-20 text-scale-2 font-bold uppercase tracking-[0.2em] bg-primary group rounded-none transition-all duration-700">
              Transmit Briefing
              <ArrowUpRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-accent" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
