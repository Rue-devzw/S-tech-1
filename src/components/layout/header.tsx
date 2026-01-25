'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../icons';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md font-primary">
      <div className="container mx-auto px-v-1 flex h-20 items-center justify-between">
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Logo className="h-6 w-6 text-primary transition-transform duration-700 group-hover:rotate-180" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">S-Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 transition-colors duration-500 hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 h-px w-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <Button asChild className="hidden md:flex bg-primary hover:bg-primary/90 text-[10px] font-bold uppercase tracking-[0.3em] h-12 px-8 rounded-none transition-all duration-700">
            <Link href="/booking">Initiate Strategy</Link>
          </Button>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/5 rounded-none">
                <Menu className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] bg-background border-l border-border p-v-3 flex flex-col justify-between">
              <div className="space-y-v-3">
                <div className="flex items-center gap-3 pb-v-2 border-b border-border">
                  <Logo className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em]">S-Tech</span>
                </div>
                <nav className="flex flex-col space-y-8">
                  {navLinks.map((link, i) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-scale-3 font-bold tracking-tighter uppercase hover:text-primary transition-colors duration-700",
                        pathname === link.href ? "text-primary" : "text-muted-foreground/40"
                      )}
                    >
                      <span className="text-[10px] mr-4 opacity-40 font-secondary italic">0{i + 1}</span>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="space-y-6 pt-v-2 border-t border-border">
                <Button asChild size="lg" className="w-full h-16 bg-primary text-scale-1 font-bold uppercase tracking-widest rounded-none">
                  <Link href="/booking">Book Strategy Session</Link>
                </Button>
                <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">
                  <span>Harare, ZW</span>
                  <span>Operational Status: Primary</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
