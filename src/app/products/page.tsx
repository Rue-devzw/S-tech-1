'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, CreditCard, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const products = [
    {
        id: 'ai-workflow-templates',
        title: 'AI Workflow Templates',
        category: 'Automation',
        price: 'Free',
        description: 'A suite of optimized prompts and workflow configurations for high-speed software development.',
        icon: ShoppingCart,
        tag: 'Quick Download'
    },
    {
        id: 'premium-design-assets',
        title: 'Visual Logic Kit',
        category: 'Design',
        price: '$129',
        description: 'Our proprietary design system tokens and visual assets for high-end web engineering.',
        icon: CreditCard,
        tag: 'Premium'
    }
];

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
            <div className="container mx-auto px-v-1">
                <div className="max-w-4xl space-y-8 mb-v-3">
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.3em]"
                    >
                        <span>Strategic Assets</span>
                    </motion.div>
                    <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-none uppercase">
                        Digital Products
                    </h1>
                    <p className="text-scale-2 text-muted-foreground font-medium max-w-2xl leading-relaxed font-secondary italic">
                        Tools and utilities designed to improve efficiency and solve focused problems.
                    </p>
                </div>

                {/* Product Grid - Asymmetric Stack */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative bg-background p-12 space-y-12 hover:bg-card transition-colors duration-700"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{product.tag}</span>
                                <span className="text-scale-3 font-bold text-accent">{product.price}</span>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-scale-3 font-bold tracking-tight leading-tight uppercase font-primary">{product.title}</h3>
                                <p className="text-scale-1 text-muted-foreground font-medium leading-relaxed font-secondary italic">{product.description}</p>
                            </div>

                            <div className="pt-6">
                                <Button asChild className="w-full h-14 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 rounded-none transition-all duration-700 group">
                                    <Link href={`/products/${product.id}`} className="flex items-center justify-center">
                                        View Product
                                        <ArrowRight className="ml-3 h-3 w-3 transition-transform group-hover:translate-x-2" />
                                    </Link>
                                </Button>
                            </div>

                            <Link href={`/products/${product.id}`} className="absolute inset-0 z-20 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
