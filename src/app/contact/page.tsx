'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Mail, MapPin, Phone, ArrowUpRight, CheckCircle2, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `*Contact Request*\n\n` +
    `*Name:* ${formData.name}\n` +
    `*Email:* ${formData.email}\n` +
    `*Service:* ${formData.service || 'Not Specified'}\n` +
    `*Message:* ${formData.message}`
  );

  const emailBody = encodeURIComponent(
    `Name: ${formData.name}\n` +
    `Email: ${formData.email}\n` +
    `Service: ${formData.service || 'Not Specified'}\n\n` +
    `Message:\n${formData.message}`
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 font-primary">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full bg-card border border-border p-12 md:p-16 text-center space-y-12"
        >
          <div className="h-px w-12 bg-primary mx-auto" />
          <div className="space-y-4">
            <h1 className="text-scale-3 font-bold tracking-tight uppercase">Detail Transmission Finalized</h1>
            <p className="text-muted-foreground text-scale-1 font-medium leading-relaxed font-secondary italic">
              Select your preferred secure channel to finalize the communication.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full h-16 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold uppercase tracking-widest rounded-none border-none">
              <Link href={`https://wa.me/263718704505?text=${whatsappMessage}`} target="_blank">
                Finalize via WhatsApp
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-16 border-border font-bold uppercase tracking-widest rounded-none">
              <Link href={`mailto:strive@s-techsolutions.org?subject=Contact Request: ${formData.name}&body=${emailBody}`}>
                Finalize via Email
              </Link>
            </Button>
          </div>

          <Button variant="link" onClick={() => setSubmitted(false)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Edit Information
          </Button>
        </motion.div>
      </div>
    );
  }

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
            Let’s Talk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-scale-2 text-muted-foreground font-medium max-w-2xl leading-relaxed font-secondary italic"
          >
            Tell us what you need. We’ll respond with clarity and direction.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-px bg-border border border-border">
          {/* Direct Contact Info - Asymmetric Left */}
          <div className="lg:col-span-5 bg-background p-12 md:p-16 space-y-16">
            {[
              { icon: MapPin, title: 'Operational HQ', value: 'Harare, Zimbabwe' },
              { icon: Phone, title: 'Direct Line', value: '+263 718 704 505' },
              { icon: Mail, title: 'Encrypted Email', value: 'strive@s-techsolutions.org' }
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

          {/* Contact Form - Asymmetric Right */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-card p-12 md:p-16 space-y-12 border-l border-border">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-14 bg-background rounded-none border-border font-medium placeholder:opacity-20"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-14 bg-background rounded-none border-border font-medium placeholder:opacity-20"
                  placeholder="Your Email"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="service_type" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Service Type</Label>
              <select
                id="service_type"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full h-14 bg-background px-4 rounded-none border border-border font-medium text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a Service</option>
                <option value="development">Software & Systems</option>
                <option value="growth">Digital Growth</option>
                <option value="repairs">Device Repairs</option>
                <option value="products">Digital Products</option>
              </select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Message</Label>
              <Textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[200px] bg-background rounded-none border-border font-medium p-8 placeholder:opacity-20"
                placeholder="Tell us about your needs..."
              />
            </div>

            <Button type="submit" className="w-full h-20 text-scale-2 font-bold uppercase tracking-[0.2em] bg-primary group rounded-none transition-all duration-700">
              Send Message
              <ArrowUpRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-accent" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
