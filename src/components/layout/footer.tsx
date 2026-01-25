import Link from 'next/link';
import { Logo } from '../icons';
import { Facebook, MessageCircle, Share2, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-16 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-10 w-10 text-primary" />
              <span className="font-headline text-2xl font-bold tracking-tight">S-TECH SOLUTIONS</span>
            </Link>
            <p className="max-w-xs text-lg font-medium leading-relaxed text-muted-foreground">
              Elite engineering for the digital age. Bridging hardware precision with software intelligence since 2014.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com/Stechsolutions/" },
                { icon: MessageCircle, href: "https://wa.me/263718704505" },
                { icon: Share2, href: "https://share.google/B1Y7focCOHEl1s975" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center border border-border/50 hover:bg-primary hover:text-background transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary">Services</h4>
            <ul className="space-y-4">
              {[
                { label: 'Software & Systems', href: '/services/software-systems' },
                { label: 'Digital Growth', href: '/services/digital-growth' },
                { label: 'Device Repairs', href: '/services/device-repairs' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center text-sm font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground">
                    {link.label}
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary">Exploration</h4>
            <ul className="space-y-4">
              {[
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Products', href: '/products' },
                { label: 'About', href: '/about' },
                { label: 'Booking', href: '/booking' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center text-sm font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground">
                    {link.label}
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 space-y-6 lg:col-span-2">
            <h4 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary">HQ</h4>
            <div className="space-y-2 text-sm font-medium text-muted-foreground">
              <p>Harate, Zimbabwe</p>
              <p>Established October 2014</p>
              <p className="pt-4 text-foreground font-bold tracking-widest text-lg">+263 718 704 505</p>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center justify-between border-t border-border/50 pt-12 md:flex-row gap-8">
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">
            &copy; {new Date().getFullYear()} S-Tech Solutions | Engineered to Lead.
          </p>
          <div className="flex gap-12 text-[10px] uppercase font-bold tracking-[0.3em]">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
