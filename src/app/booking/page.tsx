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
            <div className="min-h-screen bg-background flex items-center justify-center p-4 font-primary">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-md w-full bg-card border border-border p-12 md:p-16 text-center space-y-8"
                >
                    <div className="h-px w-12 bg-primary mx-auto" />
                    <h1 className="text-scale-3 font-bold tracking-tight uppercase">Mission Secured</h1>
                    <p className="text-muted-foreground text-scale-1 font-medium leading-relaxed font-secondary italic">
                        {state.message}
                    </p>
                    <Button asChild className="w-full h-14 bg-primary font-bold uppercase tracking-widest rounded-none">
                        <Link href="/">Return to Base</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-v-4 pb-v-4 font-primary">
            <div className="container mx-auto px-v-1">
                <div className="max-w-6xl grid lg:grid-cols-12 gap-v-4">
                    {/* Left Column: Context & Trust */}
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-5 space-y-12"
                    >
                        <div className="space-y-6">
                            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Strategic Lead Acquisition</div>
                            <h1 className="text-scale-4 md:text-scale-5 font-bold tracking-tighter leading-[0.85] uppercase">
                                Initiate <br />
                                <span className="text-primary italic font-secondary tracking-normal">Strategy.</span>
                            </h1>
                            <p className="text-scale-2 text-muted-foreground font-medium max-w-md leading-relaxed font-secondary italic">
                                Secure a high-value consultation to discuss your technical architecture or industrial hardware requirements.
                            </p>
                        </div>

                        <div className="space-y-8 pt-v-1 border-t border-border">
                            {[
                                { icon: Clock, title: '45-Minute Session', desc: 'In-depth analysis of current technical drag.' },
                                { icon: ShieldCheck, title: 'Expert Ledger', desc: 'Direct dialogue with our lead engineering team.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <item.icon className="h-6 w-6 text-primary shrink-0 transition-transform duration-700 hover:rotate-12" />
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest">{item.title}</h4>
                                        <p className="text-scale-1 text-muted-foreground font-medium font-secondary italic leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: High-End Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-7 bg-card border-l border-t lg:border-t-0 border-border p-12 md:p-16 space-y-12"
                    >
                        <form action={formAction} className="space-y-12">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Operational Intent</Label>
                                    <Select name="serviceCategory">
                                        <SelectTrigger className="h-14 bg-background rounded-none border-border font-bold uppercase tracking-widest text-[10px]">
                                            <SelectValue placeholder="SELECT SECTOR" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-border bg-background">
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
                                                    "w-full h-14 justify-start text-left font-bold uppercase tracking-widest text-[10px] rounded-none border-border bg-background",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-3 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>PICK DATE</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-none border-border bg-background" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                                className="rounded-none"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {state?.errors?.preferredDate && <p className="text-[10px] text-accent uppercase tracking-widest font-bold">{state.errors.preferredDate[0]}</p>}
                                </div>
                            </div>

                            <div className="space-y-12 border-t border-border pt-12">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Identification</Label>
                                        <Input name="name" className="h-14 bg-background rounded-none border-border font-medium placeholder:opacity-20" placeholder="NAME / ORG" />
                                        {state?.errors?.name && <p className="text-[10px] text-accent uppercase tracking-widest font-bold">{state.errors.name[0]}</p>}
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Communication Protocol</Label>
                                        <Input name="email" className="h-14 bg-background rounded-none border-border font-medium placeholder:opacity-20" placeholder="EMAIL ADDRESS" />
                                        {state?.errors?.email && <p className="text-[10px] text-accent uppercase tracking-widest font-bold">{state.errors.email[0]}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">The Brief</Label>
                                    <Input name="projectDetails" className="h-14 bg-background rounded-none border-border font-medium placeholder:opacity-20" placeholder="DESCRIBE MISSION" />
                                    {state?.errors?.projectDetails && <p className="text-[10px] text-accent uppercase tracking-widest font-bold">{state.errors.projectDetails[0]}</p>}
                                </div>

                                <Button disabled={isPending} type="submit" className="w-full h-16 text-scale-1 font-bold uppercase tracking-[0.2em] bg-primary group rounded-none transition-all duration-700">
                                    {isPending ? 'TRANSMITTING...' : 'Commandeer Session'}
                                    {!isPending && <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-2 text-accent" />}
                                </Button>
                            </div>
                        </form>

                        <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-center text-muted-foreground/30">
                            Encrypted Submission Pipeline Active
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
