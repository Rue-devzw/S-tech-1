import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import WhatsAppCTA from '@/components/ui/WhatsAppCTA';

export const metadata: Metadata = {
  title: {
    default: 'S-Tech Solutions | Elite Engineering & AI-Powered Development',
    template: '%s | S-Tech Solutions'
  },
  description: 'Pro-grade software systems, strategic digital growth, and expert hardware repairs. Bridging technical precision with business intelligence since 2014.',
  keywords: ['Software Engineering', 'AI Development', 'Digital Branding', 'SEO Harare', 'Hardware Repair Zimbabwe', 'S-Tech Solutions'],
  authors: [{ name: 'S-Tech Solutions' }],
  creator: 'S-Tech Solutions',
  openGraph: {
    type: 'website',
    locale: 'en_ZW',
    url: 'https://s-tech.co.zw',
    siteName: 'S-Tech Solutions',
    title: 'S-Tech Solutions | Elite Engineering',
    description: 'Pro-grade software systems and hardware repairs since 2014.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'S-Tech Solutions' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S-Tech Solutions | Elite Engineering',
    description: 'Pro-grade software systems and hardware repairs since 2014.',
    images: ['/og-image.jpg']
  },
  icons: {
    icon: '/logo.svg',
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-primary antialiased bg-background text-foreground")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <WhatsAppCTA />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
