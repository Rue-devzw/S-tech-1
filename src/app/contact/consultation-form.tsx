'use client';

import React, { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { submitConsultationRequest } from '../actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  message: '',
  success: false,
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" /> Send Consultation Request
        </>
      )}
    </Button>
  );
}

export default function ConsultationForm() {
    const [state, formAction] = useActionState(submitConsultationRequest, initialState);
    const [preferredDate, setPreferredDate] = useState<Date | undefined>();
    const [formKey, setFormKey] = useState(Math.random().toString());

    useEffect(() => {
        if (state.success) {
            setFormKey(Math.random().toString());
            setPreferredDate(undefined);
        }
    }, [state.success]);

    return (
        <div className="space-y-4">
             {state.message && (
                <Alert variant={state.success ? 'default' : 'destructive'} className={state.success ? 'bg-green-50 border-green-200' : ''}>
                    {state.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{state.success ? 'Success!' : 'Error'}</AlertTitle>
                    <AlertDescription>
                        {state.message}
                    </AlertDescription>
                </Alert>
            )}

            {!state.success && (
                <form key={formKey} action={formAction} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" />
                            {state.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" />
                            {state.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email[0]}</p>}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input id="company" name="company" placeholder="InnovateCorp" />
                    </div>
                    <div>
                        <Label htmlFor="projectDetails">Project Details</Label>
                        <Textarea
                            id="projectDetails"
                            name="projectDetails"
                            placeholder="Tell us about your app idea or web development needs..."
                            className="min-h-[120px]"
                        />
                         {state.errors?.projectDetails && <p className="text-sm text-destructive mt-1">{state.errors.projectDetails[0]}</p>}
                    </div>
                    <div>
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
                        <input type="hidden" name="preferredDate" value={preferredDate ? format(preferredDate, 'yyyy-MM-dd') : ''} />
                        {state.errors?.preferredDate && <p className="text-sm text-destructive mt-1">{state.errors.preferredDate[0]}</p>}
                    </div>
                    <SubmitButton />
                </form>
            )}
        </div>
    )
}
