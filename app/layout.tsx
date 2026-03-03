import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "S-Tech Studios | Premium Digital Products",
  description:
    "S-Tech Studios designs and delivers secure digital products, AI-powered systems, and scalable platforms for growth-focused teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${sora.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
