'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { submitConsultationRequest } from '../actions';
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckCircle, Loader2, ServerCrash } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState = {
  message: '',
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Request Consultation
    </Button>
  );
}

export default function ConsultationForm() {
  const [state, formAction] = useActionState(submitConsultationRequest, initialState);
  const [preferredDate, setPreferredDate] = React.useState<Date | undefined>();

  const [formKey, setFormKey] = React.useState(() => Math.random().toString());

  const handleReset = () => {
    setPreferredDate(undefined);
    setFormKey(Math.random().toString());
    // Directly clear state without involving another action
    state.success = false;
    state.message = '';
    state.errors = {};
  };

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 p-12 text-center">
        <CheckCircle className="h-12 w-12 text-primary" />
        <h3 className="mt-4 text-2xl font-bold font-headline text-primary">Consultation Requested!</h3>
        <p className="mt-2 text-muted-foreground">
          {state.message}
        </p>
        <Button onClick={handleReset} variant="outline" className="mt-6">
          Schedule Another
        </Button>
      </div>
    );
  }

  return (
    <form key={formKey} action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" />
                {state.errors?.name && <p className="mt-1 text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
            <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" />
                {state.errors?.email && <p className="mt-1 text-sm text-destructive">{state.errors.email[0]}</p>}
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
            {state.errors?.projectDetails && <p className="mt-1 text-sm text-destructive">{state.errors.projectDetails[0]}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Preferred Consultation Date</Label>
          <Input type="hidden" name="preferredDate" value={preferredDate?.toISOString()} />
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
          {state.errors?.preferredDate && <p className="mt-1 text-sm text-destructive">{state.errors.preferredDate[0]}</p>}
        </div>

        <SubmitButton />

        {!state.success && state.message && !state.errors && (
            <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}
    </form>
  )
}
