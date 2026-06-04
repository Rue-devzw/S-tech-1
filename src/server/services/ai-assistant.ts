import { AIInteractionType } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { redactContext, redactSensitiveText, wasRedacted } from "@/server/security";
import { aiApprovalSchema, aiAssistSchema } from "@/server/validation";

type AIProviderResult = {
  text: string;
  provider: string;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  costEstimate?: number;
  fallbackUsed?: boolean;
};

type PromptTemplate = {
  title: string;
  system: string;
  instruction: string;
  customerFacing: boolean;
  fallback: string;
};

const customerFacingTypes: AIInteractionType[] = ["CUSTOMER_ENQUIRY", "QUOTATION_DESCRIPTION", "ADVERT_DRAFT", "FAQ_ASSISTANT", "SUPPORT_CHAT"];

export const promptTemplates: Record<AIInteractionType, PromptTemplate> = {
  DIAGNOSTICS: {
    title: "Diagnostic assistant",
    customerFacing: false,
    system: "You assist OmniTech technicians with structured technical diagnosis. You do not claim certainty without evidence.",
    instruction: "Summarise likely causes, checks to perform, parts to inspect, risk notes and next technician actions.",
    fallback: "Start with intake notes, reproduce the fault, inspect power and visible damage, confirm accessories, run safe diagnostics, document findings, and request approval before paid work."
  },
  CUSTOMER_ENQUIRY: {
    title: "Customer enquiry assistant",
    customerFacing: true,
    system: "You draft clear OmniTech customer replies. Be helpful, honest and avoid promises about price or completion time unless provided.",
    instruction: "Draft a friendly response that confirms the enquiry, asks for missing details and points to the right service path.",
    fallback: "Thank you for contacting OmniTech Solutions. Please share the device/service type, fault or goal, location, urgency and any photos so our team can advise the next step."
  },
  QUOTATION_DESCRIPTION: {
    title: "Quotation description helper",
    customerFacing: true,
    system: "You help write quotation descriptions. Use plain language and avoid hidden assumptions.",
    instruction: "Create a concise quotation description covering scope, exclusions, customer approval and next steps.",
    fallback: "Service labour, inspection and required work as discussed. Final work proceeds after customer approval; parts availability and warranty terms are confirmed on the invoice or job card."
  },
  ADVERT_DRAFT: {
    title: "Advert copy generator",
    customerFacing: true,
    system: "You draft OmniTech adverts that are truthful, practical and premium. Do not claim official Starlink partnership.",
    instruction: "Produce short advert copy with headline, body, CTA and channel notes.",
    fallback: "Headline: Practical technology support from OmniTech. Body: Repairs, connectivity, websites, software and automation for homes and organisations. CTA: Request service today."
  },
  REPORT_GENERATION: {
    title: "Service report generator",
    customerFacing: false,
    system: "You turn technician notes into structured service reports for internal review and customer handover after human approval.",
    instruction: "Generate report sections: work requested, checks completed, findings, work done, recommendations, evidence needed and follow-up.",
    fallback: "Report draft: document request, site/device condition, checks completed, findings, work performed, test result, recommendations, photos/evidence and follow-up actions."
  },
  FAQ_ASSISTANT: {
    title: "FAQ assistant",
    customerFacing: true,
    system: "You answer FAQs using only provided OmniTech context. If unsure, ask the user to contact OmniTech.",
    instruction: "Answer in a short, safe, customer-friendly way and suggest the relevant OmniTech service.",
    fallback: "OmniTech can help with repairs, networking, Starlink-related installation support, websites, software and automation. For exact advice, please submit a service request with details."
  },
  SUPPORT_CHAT: {
    title: "Support chatbot",
    customerFacing: true,
    system: "You triage customer support messages. You do not diagnose high-risk faults remotely as final.",
    instruction: "Ask clarifying questions, suggest safe first checks and route to a service request when needed.",
    fallback: "Please share the model, fault, when it started, any error messages, and photos if available. Avoid risky repairs yourself; OmniTech can inspect and advise."
  },
  TECHNICIAN_TROUBLESHOOTING: {
    title: "Technician troubleshooting guide",
    customerFacing: false,
    system: "You assist technicians with safe troubleshooting. Prioritise safety, evidence and reversible checks.",
    instruction: "Create a step-by-step troubleshooting checklist with safety notes, test tools, likely causes and escalation triggers.",
    fallback: "Troubleshooting guide: confirm symptoms, isolate power/network/software variables, test with known-good accessories, document evidence, avoid unsafe live work, and escalate board-level or high-risk faults."
  },
  SUMMARY: {
    title: "Operational summary",
    customerFacing: false,
    system: "You summarise operational information for OmniTech staff.",
    instruction: "Summarise key facts, risks, decisions needed and next actions.",
    fallback: "Summary: capture the current state, blockers, customer impact, next action owner and deadline."
  },
  MANAGEMENT_INSIGHTS: {
    title: "Management insights summary",
    customerFacing: false,
    system: "You produce concise management summaries from provided operational data.",
    instruction: "Identify trends, risks, service opportunities, bottlenecks and recommended management actions.",
    fallback: "Management insight: review request volume, quote approvals, overdue jobs, parts delays, technician capacity, revenue status and customer follow-up gaps."
  }
};

function renderTemplate(template: PromptTemplate, input: string, context: Record<string, unknown>) {
  return [
    `System: ${template.system}`,
    `Brand promise: We repair. We connect. We build. We automate.`,
    "Safety rules: do not invent facts, do not expose secrets, do not provide unsafe electrical instructions, do not claim official Starlink partnership, and mark customer-facing output as draft for human approval.",
    `Task: ${template.instruction}`,
    `Context: ${JSON.stringify(context)}`,
    `User input: ${input}`
  ].join("\n\n");
}

function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 4));
}

function estimateCost(tokensIn: number, tokensOut: number) {
  const inputRate = Number(process.env.AI_COST_INPUT_PER_1K ?? "0");
  const outputRate = Number(process.env.AI_COST_OUTPUT_PER_1K ?? "0");
  return Number(((tokensIn / 1000) * inputRate + (tokensOut / 1000) * outputRate).toFixed(6));
}

function runGuardrails(type: AIInteractionType, input: string, context: Record<string, unknown>) {
  const haystack = `${input} ${JSON.stringify(context)}`.toLowerCase();
  const flags: string[] = [];
  if (haystack.includes("official starlink partner") || haystack.includes("authorized starlink")) flags.push("STARLINK_PARTNERSHIP_CLAIM");
  if (/(password|secret|api[_ -]?key|token)/i.test(haystack)) flags.push("SENSITIVE_DATA");
  if (/(bypass|hack|exploit|malware|phishing)/i.test(haystack)) flags.push("CYBER_ABUSE_RISK");
  if (/(live wire|open power supply|shock|mains)/i.test(haystack)) flags.push("ELECTRICAL_SAFETY_RISK");
  if (customerFacingTypes.includes(type)) flags.push("HUMAN_APPROVAL_REQUIRED");
  return flags;
}

function fallbackResponse(type: AIInteractionType, input: string, context: Record<string, unknown>) {
  const template = promptTemplates[type];
  const subject = String(context.subject ?? context.service ?? "").trim();
  return subject ? `${template.fallback}\n\nContext focus: ${subject}\n\nOriginal note: ${input.slice(0, 500)}` : `${template.fallback}\n\nOriginal note: ${input.slice(0, 500)}`;
}

async function callHttpProvider(prompt: string): Promise<AIProviderResult> {
  const endpoint = process.env.AI_PROVIDER_BASE_URL;
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  const model = process.env.AI_MODEL ?? "provider-default";
  if (!endpoint) throw new Error("AI provider endpoint is not configured.");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({ model, prompt })
  });
  if (!response.ok) throw new Error(`AI provider failed with status ${response.status}.`);
  const payload = await response.json();
  const text = String(payload.text ?? payload.response ?? payload.output ?? "");
  if (!text.trim()) throw new Error("AI provider returned an empty response.");
  const tokensIn = Number(payload.tokensIn ?? estimateTokens(prompt));
  const tokensOut = Number(payload.tokensOut ?? estimateTokens(text));
  return {
    text,
    provider: process.env.AI_ASSISTANT_PROVIDER ?? "http",
    model,
    tokensIn,
    tokensOut,
    costEstimate: Number(payload.costEstimate ?? estimateCost(tokensIn, tokensOut))
  };
}

async function runProvider(type: AIInteractionType, prompt: string, input: string, context: Record<string, unknown>): Promise<AIProviderResult> {
  const provider = process.env.AI_ASSISTANT_PROVIDER ?? "local-fallback";
  if (provider === "http") return callHttpProvider(prompt);
  const text = fallbackResponse(type, input, context);
  const tokensIn = estimateTokens(prompt);
  const tokensOut = estimateTokens(text);
  return {
    text,
    provider: "local-fallback",
    model: "deterministic-template",
    tokensIn,
    tokensOut,
    costEstimate: estimateCost(tokensIn, tokensOut),
    fallbackUsed: true
  };
}

export async function runAIAssistant(input: unknown, actorId: string) {
  const parsed = aiAssistSchema.parse(input);
  const template = promptTemplates[parsed.type];
  const redactedInput = redactSensitiveText(parsed.input);
  const redactedContext = redactContext(parsed.context);
  const prompt = renderTemplate(template, redactedInput, redactedContext);
  const safetyFlags = runGuardrails(parsed.type, parsed.input, parsed.context);
  if (wasRedacted(parsed.input, redactedInput) || JSON.stringify(parsed.context) !== JSON.stringify(redactedContext)) {
    safetyFlags.push("SENSITIVE_DATA_REDACTED");
  }
  const approvalRequired = parsed.requireApproval ?? parsed.customerFacing ?? template.customerFacing;

  let result: AIProviderResult;
  try {
    result = await runProvider(parsed.type, prompt, redactedInput, redactedContext);
  } catch (error) {
    const text = fallbackResponse(parsed.type, redactedInput, redactedContext);
    const tokensIn = estimateTokens(prompt);
    const tokensOut = estimateTokens(text);
    result = {
      text,
      provider: "local-fallback",
      model: "deterministic-template",
      tokensIn,
      tokensOut,
      costEstimate: estimateCost(tokensIn, tokensOut),
      fallbackUsed: true
    };
    safetyFlags.push("PROVIDER_FALLBACK_USED");
  }

  const interaction = await prisma.aIInteraction.create({
    data: {
      type: parsed.type,
      provider: result.provider,
      model: result.model,
      prompt,
      response: result.text,
      finalResponse: approvalRequired ? null : result.text,
      approvalStatus: approvalRequired ? "PENDING" : "NOT_REQUIRED",
      safetyFlags,
      fallbackUsed: Boolean(result.fallbackUsed),
      metadata: {
        template: template.title,
        context: redactedContext,
        customerFacing: approvalRequired,
        guardrails: safetyFlags
      },
      userId: actorId,
      jobCardId: parsed.jobCardId,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      costEstimate: result.costEstimate
    }
  });

  await audit("AI_INTERACTION_CREATED", "AIInteraction", interaction.id, actorId, {
    type: interaction.type,
    approvalStatus: interaction.approvalStatus,
    fallbackUsed: interaction.fallbackUsed,
    safetyFlags
  });
  return interaction;
}

export async function approveAIInteraction(id: string, input: unknown, actorId: string) {
  const parsed = aiApprovalSchema.parse(input);
  const interaction = await prisma.aIInteraction.update({
    where: { id },
    data: {
      approvalStatus: parsed.decision,
      finalResponse: parsed.decision === "APPROVED" ? parsed.finalResponse : null,
      approvedAt: new Date(),
      approvedById: actorId,
      metadata: {
        approvalNote: parsed.note
      }
    }
  });
  await audit("AI_INTERACTION_REVIEWED", "AIInteraction", interaction.id, actorId, {
    decision: parsed.decision
  });
  return interaction;
}

export async function listAIInteractions() {
  return prisma.aIInteraction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true, approvedBy: true, jobCard: true }
  });
}
