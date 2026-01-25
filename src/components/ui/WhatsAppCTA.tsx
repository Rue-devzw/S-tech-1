'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppCTA() {
    return (
        <motion.a
            href="https://wa.me/263718704505"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center bg-primary text-background shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.5)] border-2 border-primary transition-shadow"
        >
            <MessageCircle className="h-8 w-8" />
            <span className="sr-only">Contact on WhatsApp</span>
        </motion.a>
    );
}
