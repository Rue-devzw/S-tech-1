'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Send } from 'lucide-react';
import { format } from 'date-fns';

export default function ConsultationForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [projectDetails, setProjectDetails] = useState('');
    const [preferredDate, setPreferredDate] = useState<Date | undefined>();

    const handleSubmit = () => {
        const subject = encodeURIComponent(`Consultation Request from ${name}`);
        const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Company: ${company || 'N/A'}
Preferred Date: ${preferredDate ? format(preferredDate, "PPP") : 'Not specified'}

Project Details:
${projectDetails}`
        );
        window.location.href = `mailto:info@s-techsolutions.org?subject=${subject}&body=${body}`;
    };

    const isFormValid = name && email && projectDetails && preferredDate;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
            </div>
            <div>
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" name="company" placeholder="InnovateCorp" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="projectDetails">Project Details</Label>
                <Textarea
                    id="projectDetails"
                    name="projectDetails"
                    placeholder="Tell us about your app idea or web development needs..."
                    className="min-h-[120px]"
                    value={projectDetails}
                    onChange={e => setProjectDetails(e.target.value)}
                />
            </div>
            <div className="flex flex-col space-y-2">
                <Label>Preferred Consultation Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !preferredDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {preferredDate ? format(preferredDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={preferredDate}
                            onSelect={setPreferredDate}
                            disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1))
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Button onClick={handleSubmit} className="w-full" disabled={!isFormValid}>
                <Send className="mr-2 h-4 w-4" />
                Send Consultation Request
            </Button>
            {!isFormValid && <p className="text-center text-sm text-muted-foreground">Please fill out all fields to send the request.</p>}
        </div>
    )
}
