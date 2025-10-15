'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitRepairQuote } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, CheckCircle, Clock, Cpu, FileText, Loader2, ServerCrash } from 'lucide-react';

const initialState = {
  message: '',
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quote...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" /> Get AI Quote
        </>
      )}
    </Button>
  );
}

export default function RepairQuoteForm() {
  const [state, formAction] = useActionState(submitRepairQuote, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="device">Device Type</Label>
          <Input id="device" name="device" placeholder="e.g., iPhone 13, Samsung Galaxy S21" required />
          {state.errors?.device && (
            <p className="mt-1 text-sm text-destructive">{state.errors.device[0]}</p>
          )}
        </div>
        <div>
          <Label htmlFor="issue">Describe the Issue</Label>
          <Textarea id="issue" name="issue" placeholder="e.g., Cracked screen, battery not charging" required />
          {state.errors?.issue && (
            <p className="mt-1 text-sm text-destructive">{state.errors.issue[0]}</p>
          )}
        </div>
        <SubmitButton />
      </form>

      {state.success && state.data ? (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <FileText className="h-6 w-6" />
              <span>Your Repair Quote</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-bold">{state.data.quote}</p>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <strong>Estimated Time:</strong>
                <span>{state.data.estimatedCompletionTime}</span>
              </div>
              <div className="flex items-start gap-2">
                <Cpu className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <strong>Likely Parts Needed:</strong>
                <ul className="flex flex-wrap gap-2">
                  {state.data.likelyParts.map((part, i) => (
                    <li key={i} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {part}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Alert className="bg-background">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                This is an AI-generated estimate. Final price may vary after in-person inspection.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : !state.success && state.message && !state.errors && (
        <Alert variant="destructive">
          <ServerCrash className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
