import Link from 'next/link';
import { Logo } from '../icons';
import { Facebook, MessageCircle, Share2, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background pt-v-4 pb-v-2 font-primary">
      <div className="container mx-auto px-v-1">
        <div className="grid gap-v-3 md:grid-cols-12 items-start">
          <div className="md:col-span-12 lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em]">S-TECH SOLUTIONS</span>
            </Link>
            <p className="max-w-md text-scale-2 font-secondary font-medium italic text-muted-foreground leading-relaxed">
              Engineered for the digital age. We bridge the gap between microscopic hardware diagnostics and macroscopic software intelligence.
            </p>
            <div className="flex gap-6">
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
                  className="flex h-10 w-10 items-center justify-center border border-border/50 hover:border-primary hover:text-primary transition-all duration-700"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Capabilities</h4>
            <ul className="space-y-4">
              {[
                { label: 'Software & Systems', href: '/services/software-systems' },
                { label: 'Digital Growth', href: '/services/digital-growth' },
                { label: 'Hardware Lifecycle', href: '/services/device-repairs' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-500">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Intelligence</h4>
            <ul className="space-y-4">
              {[
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Products', href: '/products' },
                { label: 'About', href: '/about' },
                { label: 'Consultation', href: '/booking' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-500">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-3 space-y-8 border-l border-border pl-8 hidden lg:block">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Infrastructure</h4>
            <div className="space-y-4">
              <p className="text-scale-1 font-medium text-muted-foreground uppercase tracking-widest">Harare, Zimbabwe</p>
              <p className="text-scale-1 font-medium text-muted-foreground uppercase tracking-widest">Operational Since 2014</p>
              <p className="pt-4 text-scale-2 font-bold tracking-[0.2em] text-foreground">+263 718 704 505</p>
            </div>
          </div>
        </div>

        <div className="mt-v-3 flex flex-col items-center justify-between border-t border-border pt-12 md:flex-row gap-8">
          <p className="text-[8px] uppercase font-bold tracking-[0.5em] text-muted-foreground/30">
            &copy; {new Date().getFullYear()} S-Tech Solutions | Engineered to Lead.
          </p>
          <div className="flex gap-12 text-[8px] uppercase font-bold tracking-[0.5em] text-muted-foreground/30">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Protocal</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Engagement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
