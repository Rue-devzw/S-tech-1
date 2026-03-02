'use server';
/**
 * @fileOverview An AI agent for generating compelling and SEO-friendly service descriptions.
 *
 * - generateServiceDescription - A function that handles the generation of service descriptions.
 * - GenerateServiceDescriptionInput - The input type for the generateServiceDescription function.
 * - GenerateServiceDescriptionOutput - The return type for the generateServiceDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateServiceDescriptionInputSchema = z.object({
  serviceName: z.string().describe('The name of the service to be described.'),
  category: z.string().describe('The category of the service (e.g., "Web Development", "AI Cybersecurity").'),
  keywords: z.array(z.string()).describe('A list of SEO keywords relevant to the service.'),
  targetAudience: z.string().describe('A description of the target audience for this service.'),
  keyFeatures: z.array(z.string()).describe('A list of key features and benefits of the service.'),
});
export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated compelling and SEO-friendly service description.'),
});
export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;

export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  return generateServiceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: { schema: GenerateServiceDescriptionInputSchema },
  output: { schema: GenerateServiceDescriptionOutputSchema },
  prompt: `You are an expert copywriter specializing in creating compelling and SEO-friendly descriptions for digital services for S-Tech Solutions based in Zimbabwe.

Generate a detailed and persuasive service description based on the following information:

Service Name: {{{serviceName}}}
Category: {{{category}}}
Keywords: {{#each keywords}}- {{{this}}}
{{/each}}
Target Audience: {{{targetAudience}}}
Key Features: {{#each keyFeatures}}- {{{this}}}
{{/each}}

The description should:
- Be engaging and highlight the unique value proposition of the service.
- Incorporate the provided keywords naturally for SEO optimization.
- Address the needs and benefits for the specified target audience.
- Be detailed enough to inform potential clients about what the service offers.
- Be between 150-300 words.
- Use a professional yet appealing tone.
- Clearly state that this service is offered by S-Tech Solutions.
`,
});

const generateServiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateServiceDescriptionFlow',
    inputSchema: GenerateServiceDescriptionInputSchema,
    outputSchema: GenerateServiceDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
