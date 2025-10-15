import Link from 'next/link';
import { Logo } from '../icons';

export function Footer() {
  return (
    <footer className="w-full border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">S-Tech Services</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Expert Repairs &amp; AI-Powered Development.
              <br />
              Since 2014.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-4">
            <div className="space-y-2">
              <h4 className="font-headline text-sm font-semibold">Services</h4>
              <ul className="space-y-1">
                <li><Link href="/repairs" className="text-sm hover:underline">Repairs</Link></li>
                <li><Link href="/development" className="text-sm hover:underline">Development</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-headline text-sm font-semibold">Company</h4>
              <ul className="space-y-1">
                <li><Link href="/about" className="text-sm hover:underline">About Us</Link></li>
                <li><Link href="/portfolio" className="text-sm hover:underline">Portfolio</Link></li>
              </ul>
            </div>
             <div className="space-y-2">
              <h4 className="font-headline text-sm font-semibold">Legal</h4>
              <ul className="space-y-1">
                <li><Link href="#" className="text-sm hover:underline">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm hover:underline">Terms of Service</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-headline text-sm font-semibold">Connect</h4>
              <ul className="space-y-1">
                <li><Link href="/contact" className="text-sm hover:underline">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} S-Tech Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
