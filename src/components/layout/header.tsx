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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Logo className="h-8 w-8 text-primary transition-transform duration-500 group-hover:rotate-90" />
              <div className="absolute -inset-1 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight uppercase">S-Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-xs font-bold tracking-[0.2em] uppercase md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-foreground/60"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Button asChild className="hidden md:flex group relative overflow-hidden bg-primary px-8 hover:bg-primary/90">
            <Link href="/booking" className="flex items-center">
              <span>Book Now</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background/95 backdrop-blur-2xl border-l border-border/50">
              <div className="mt-12 flex flex-col space-y-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "font-headline text-4xl font-bold tracking-tighter hover:text-primary transition-colors",
                      pathname === link.href ? "text-primary" : "text-foreground/40"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-8 flex flex-col gap-4">
                  <Button asChild size="lg" className="h-16 text-xl font-bold">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
