'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useActionState } from 'react';
import { cn } from '@/lib/utils';
import { submitConsultationRequest } from '../actions';
import Link from 'next/link';

type ConsultationState = {
    message: string;
    success: boolean;
    errors?: {
        name?: string[];
        email?: string[];
        projectDetails?: string[];
        preferredDate?: string[];
    }
}

const initialState: ConsultationState = {
    message: '',
    success: false,
};

export default function BookingPage() {
    const [date, setDate] = useState<Date>();
    const [state, formAction, isPending] = useActionState(submitConsultationRequest, initialState);

    if (state.success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-secondary/5 border border-border/50 p-12 text-center space-y-8"
                >
                    <CheckCircle2 className="h-20 w-20 text-primary mx-auto" />
                    <h1 className="font-headline text-4xl font-bold tracking-tight uppercase">MISSION SECURED</h1>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        {state.message}
                    </p>
                    <Button asChild className="w-full h-16 bg-primary font-bold uppercase tracking-widest">
                        <Link href="/">Return to Base</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-48">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl grid lg:grid-cols-12 gap-24">
                    {/* Left Column: Context & Trust */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Qualified Leads Only</div>
                            <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85]">
                                INITIATE <br />
                                <span className="text-primary italic">STRATEGY.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
                                Secure a high-value consultation to discuss your technical architecture or hardware requirements.
                            </p>
                        </div>

                        <div className="space-y-8 pt-8 border-t border-border/50">
                            {[
                                { icon: Clock, title: '45-Min Session', desc: 'In-depth analysis of your current technical constraints.' },
                                { icon: ShieldCheck, title: 'Expert Ledger', desc: 'Direct dialogue with our lead engineering team.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <item.icon className="h-8 w-8 text-primary shrink-0" />
                                    <div className="space-y-1">
                                        <h4 className="font-bold uppercase tracking-widest">{item.title}</h4>
                                        <p className="text-muted-foreground font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: High-End Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-7 bg-secondary/5 border border-border/50 p-12 md:p-16 space-y-12"
                    >
                        <form action={formAction} className="space-y-12">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Strategic Intent</Label>
                                    <Select name="serviceCategory">
                                        <SelectTrigger className="h-16 bg-background rounded-none border-border/50 font-bold uppercase tracking-widest text-[10px]">
                                            <SelectValue placeholder="SELECT SERVICE CATEGORY" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="software">Software & AI Systems</SelectItem>
                                            <SelectItem value="growth">Digital Growth & SEO</SelectItem>
                                            <SelectItem value="hardware">Industrial-Grade Repairs</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Target Date</Label>
                                    <input type="hidden" name="preferredDate" value={date ? format(date, "yyyy-MM-dd") : ''} />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full h-16 justify-start text-left font-bold uppercase tracking-widest text-[10px] rounded-none border-border/50 bg-background",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>PICK A DATE</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-none border-border/50" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {state?.errors?.preferredDate && <p className="text-xs text-destructive uppercase tracking-widest font-bold">{state.errors.preferredDate[0]}</p>}
                                </div>
                            </div>

                            <div className="space-y-12 border-t border-border/50 pt-12">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Full Name</Label>
                                        <Input name="name" className="h-16 bg-background rounded-none border-border/50 font-medium placeholder:opacity-20" placeholder="IDENTIFY YOURSELF" />
                                        {state?.errors?.name && <p className="text-xs text-destructive uppercase tracking-widest font-bold">{state.errors.name[0]}</p>}
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Contact Protocol</Label>
                                        <Input name="email" className="h-16 bg-background rounded-none border-border/50 font-medium placeholder:opacity-20" placeholder="EMAIL ADDRESS" />
                                        {state?.errors?.email && <p className="text-xs text-destructive uppercase tracking-widest font-bold">{state.errors.email[0]}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Objective Brief</Label>
                                    <Input name="projectDetails" className="h-16 bg-background rounded-none border-border/50 font-medium placeholder:opacity-20" placeholder="DESCRIBE THE MISSION" />
                                    {state?.errors?.projectDetails && <p className="text-xs text-destructive uppercase tracking-widest font-bold">{state.errors.projectDetails[0]}</p>}
                                </div>

                                <Button disabled={isPending} type="submit" className="w-full h-20 text-xl font-bold uppercase tracking-[0.2em] bg-primary group">
                                    {isPending ? 'TRANSMITTING...' : 'Commandeer Session'}
                                    {!isPending && <ArrowRight className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-2" />}
                                </Button>
                            </div>
                        </form>

                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-center text-muted-foreground/40">
                            Encrypted Submission Pipeline Active
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
