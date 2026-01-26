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
        <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
            <div className="container mx-auto px-v-1">
                <Link href="/products" className="group inline-flex items-center gap-4 mb-v-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors duration-500">
                    <ArrowLeft className="h-4 w-4 transition-transform duration-700 group-hover:-translate-x-2" />
                    Back to Catalog
                </Link>

                <div className="grid lg:grid-cols-12 gap-v-3 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-7 space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Strategic Resource</div>
                            <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-[0.95] uppercase">
                                {slug.split('-').join(' ')}
                            </h1>
                            <p className="text-scale-2 md:text-scale-3 text-muted-foreground font-medium leading-relaxed max-w-xl font-secondary italic">
                                Our proprietary framework for deterministic execution. This asset contains years of refined technical intelligence compressed into a reusable operational format.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">Asset Specifications</h4>
                            <div className="grid sm:grid-cols-2 gap-px bg-border">
                                {[
                                    'Architectural Logic Schema',
                                    'Deterministic Logic Blocks',
                                    'High-Performance Tokens',
                                    'Legacy Update Support'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-6 bg-background text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-5 border-l border-t lg:border-t-0 border-border bg-card p-12 md:p-16 space-y-12 sticky top-32"
                    >
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">License: Corporate</p>
                            <div className="text-scale-4 font-bold text-accent">$129.00</div>
                        </div>

                        <div className="space-y-4">
                            <Button className="w-full h-20 text-scale-1 font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none transition-all duration-700">
                                Secure Asset Access
                            </Button>
                            <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                                <Lock className="h-3 w-3" />
                                Encrypted Protocol
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border space-y-6">
                            <div className="flex gap-4 items-start">
                                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Instant Transmit</p>
                                    <p className="text-scale-1 text-muted-foreground font-medium font-secondary italic leading-relaxed">Download links are generated and encrypted post-verification.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
