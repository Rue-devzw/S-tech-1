'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Wrench, Cpu, Briefcase, Info, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../icons';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';

const navLinks = [
  { href: '/repairs', label: 'Repairs', icon: <Wrench className="h-4 w-4" /> },
  { href: '/development', label: 'Development', icon: <Cpu className="h-4 w-4" /> },
  { href: '/portfolio', label: 'Portfolio', icon: <Briefcase className="h-4 w-4" /> },
  { href: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">S-Tech Services</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) =>
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
          <Button asChild>
            <Link href="/contact">
              Contact Us <Mail className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="mb-4 flex items-center gap-2">
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">S-Tech Services</span>
                </Link>
                <nav className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md p-2 text-lg font-medium",
                        pathname === link.href ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
                      )}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
