'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShoppingBag, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    return (
        <div className="min-h-screen bg-background pt-32 pb-48">
            <div className="container mx-auto px-4">
                <Link href="/products" className="group inline-flex items-center gap-2 mb-12 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Assets
                </Link>

                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="text-xs font-bold uppercase tracking-[0.4em] text-primary">High-Value Resource</div>
                            <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-tight uppercase">
                                {slug.split('-').join(' ')}
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                                Our proprietary framework for high-speed digital execution. This asset contains years of refined engineering intelligence compressed into a usable format.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-foreground">Included in this asset:</h4>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {[
                                    'Complete Architectural Schema',
                                    'Proprietary Logic Blocks',
                                    'High-Performance Style Tokens',
                                    'Lifetime Performance Updates'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-5 border border-border/50 bg-secondary/5 p-12 space-y-12 sticky top-32"
                    >
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">License: Individual Use</p>
                            <div className="text-5xl font-headline font-bold">$129.00</div>
                        </div>

                        <div className="space-y-4">
                            <Button className="w-full h-20 text-lg font-bold uppercase tracking-widest bg-primary hover:bg-primary/90">
                                Secure Asset Now
                            </Button>
                            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                <Lock className="h-3 w-3" />
                                Encrypted Transaction
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border/50 space-y-6">
                            <div className="flex gap-4 items-start">
                                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">Immediate Delivery</p>
                                    <p className="text-xs text-muted-foreground font-medium">Download links are generated instantly post-verification.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
