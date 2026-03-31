"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CONTACT_TOPICS,
  type ContactTopicValue,
} from "@/lib/contact-topics";
import { type Listing } from "@/lib/mock-data";

export function ContactForm({
  initialTopic,
  selectedListing,
}: {
  initialTopic: ContactTopicValue;
  selectedListing: Listing | null;
}) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    company: "",
    topic: initialTopic,
    timeline: "",
    message: "",
    website: "",
  });

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: selectedListing?.id,
          topic: form.topic,
          userName: form.fullName,
          userEmail: form.workEmail,
          company: form.company,
          timeline: form.timeline,
          message: form.message,
          website: form.website,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to send your inquiry.");
      }

      setForm((current) => ({
        ...current,
        fullName: "",
        workEmail: "",
        company: "",
        timeline: "",
        message: "",
        website: "",
      }));
      toast({
        title: "Inquiry sent",
        description: "We will get back to you within one business day.",
      });
    } catch (caughtError) {
      toast({
        title: "Unable to send inquiry",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitForm} className="space-y-5">
      {selectedListing ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Selected project</p>
          <p className="mt-1">{selectedListing.name}</p>
          <p className="mt-2 text-slate-600">
            Your inquiry will include this project as the starting point.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-full-name">Full name</Label>
          <Input
            id="contact-full-name"
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullName: event.target.value }))
            }
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-work-email">Work email</Label>
          <Input
            id="contact-work-email"
            type="email"
            value={form.workEmail}
            onChange={(event) =>
              setForm((current) => ({ ...current, workEmail: event.target.value }))
            }
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-company">Company</Label>
          <Input
            id="contact-company"
            value={form.company}
            onChange={(event) =>
              setForm((current) => ({ ...current, company: event.target.value }))
            }
            placeholder="Company or team name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-topic">What do you need help with?</Label>
          <Select
            value={form.topic}
            onValueChange={(value) =>
              setForm((current) => ({
                ...current,
                topic: value as ContactTopicValue,
              }))
            }
          >
            <SelectTrigger id="contact-topic">
              <SelectValue placeholder="Choose a topic" />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_TOPICS.map((topic) => (
                <SelectItem key={topic.value} value={topic.value}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">
            {
              CONTACT_TOPICS.find((topic) => topic.value === form.topic)
                ?.description
            }
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-timeline">Desired timeline</Label>
        <Input
          id="contact-timeline"
          value={form.timeline}
          onChange={(event) =>
            setForm((current) => ({ ...current, timeline: event.target.value }))
          }
          placeholder="For example: within 6 weeks or still planning"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Project details</Label>
        <Textarea
          id="contact-message"
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          placeholder="Tell us what you are building, where things are stuck, and what a successful outcome looks like."
          className="min-h-32"
          required
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <Label htmlFor="contact-website">Website</Label>
        <Input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) =>
            setForm((current) => ({ ...current, website: event.target.value }))
          }
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto"
      >
        {submitting ? "Sending inquiry..." : "Send inquiry"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
