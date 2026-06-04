import type { Metadata } from "next";
import { AIAssistantConsole } from "@/components/ai-assistant-console";
import { PageShell } from "@/components/site-shell";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "AI Assistant",
  description: "Provider-agnostic OmniTech AI assistant for diagnostics, reports, adverts, FAQs, troubleshooting and management summaries.",
  path: "/admin/ai",
  noIndex: true
});

export default function AdminAIPage() {
  return (
    <PageShell>
      <AIAssistantConsole />
    </PageShell>
  );
}
