export type AiMode = "diagnostics" | "advert" | "report" | "faq";

const prefixes: Record<AiMode, string> = {
  diagnostics: "Diagnostics checklist",
  advert: "Promotion draft",
  report: "Service report",
  faq: "Support answer"
};

export async function runAiAssist(mode: AiMode, prompt: string) {
  if (process.env.AI_PROVIDER && process.env.AI_PROVIDER !== "mock") {
    return {
      provider: process.env.AI_PROVIDER,
      output:
        "AI provider integration is configured as an abstraction. Add provider credentials and map this call in src/server/providers/ai.ts."
    };
  }

  return {
    provider: "mock",
    output: `${prefixes[mode]}:\n\n${prompt}\n\nRecommended next step: verify facts, document customer approval, and attach evidence to the job card before action.`
  };
}
