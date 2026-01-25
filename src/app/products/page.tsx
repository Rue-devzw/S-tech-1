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
        <div className="min-h-screen bg-background pt-32 pb-48">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl space-y-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em]"
                    >
                        <span>Scalable Value</span>
                    </motion.div>
                    <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                        DIGITAL <br />
                        <span className="text-primary italic">ASSETS.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        Proprietary tools and frameworks engineered to accelerate digital transformation. From free automation templates to premium architectural kits.
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 border border-border/50">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative bg-background p-12 space-y-12 hover:bg-secondary/5 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{product.tag}</span>
                                <span className="text-xl font-headline font-bold">{product.price}</span>
                            </div>

                            <div className="space-y-6">
                                <h3 className="font-headline text-3xl font-bold tracking-tight leading-tight">{product.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{product.description}</p>
                            </div>

                            <div className="pt-6">
                                <Button asChild className="w-full h-16 text-xs font-bold uppercase tracking-[0.2em] group">
                                    <Link href={`/products/${product.id}`} className="flex items-center justify-center">
                                        {product.price === 'Free' ? 'Download for Free' : 'Secure Access'}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
