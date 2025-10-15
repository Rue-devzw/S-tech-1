import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import LiveChatWidget from '@/components/live-chat-widget';


export const metadata: Metadata = {
  title: 'S-Tech Services Hub',
  description: 'Expert Repairs & AI-Powered Development since 2014.',
  icons: {
    icon: `data:image/svg+xml;base64,${Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <g transform="translate(5, 5) scale(0.9)">
            <path d="M 85,30 C 85,15 75,5 60,5 C 45,5 35,15 35,30 L 35,40 L 65,40 C 75,40 85,50 85,60 L 85,70 L 100,70 L 100,60 C 100,40 85,30 85,30 Z" fill="hsl(216 100% 59%)"/>
            <path d="M 15,70 C 15,85 25,95 40,95 C 55,95 65,85 65,70 L 65,60 L 35,60 C 25,60 15,50 15,40 L 15,30 L 0,30 L 0,40 C 0,60 15,70 15,70 Z" fill="hsl(34 100% 63%)"/>
        </g>
      </svg>
    `).toString('base64')}`
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <LiveChatWidget />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
