'use server';
/**
 * @fileOverview A flow to showcase AI-driven projects for S-Tech Services.
 * 
 * - aiPoweredSolutionsShowcase - A function that retrieves and formats a showcase of AI-driven projects.
 * - AiPoweredSolutionsShowcaseOutput - The return type for the aiPoweredSolutionsShowcase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredSolutionsShowcaseOutputSchema = z.object({
  showcaseItems: z.array(
    z.object({
      title: z.string().describe('The title of the project.'),
      description: z.string().describe('A brief description of the project.'),
      technologies: z.string().describe('The technologies used in the project.'),
      outcome: z.string().describe('The outcome or result of the project.'),
    })
  ).describe('An array of showcase items representing AI-driven projects.'),
});

export type AiPoweredSolutionsShowcaseOutput = z.infer<typeof AiPoweredSolutionsShowcaseOutputSchema>;

export async function aiPoweredSolutionsShowcase(): Promise<AiPoweredSolutionsShowcaseOutput> {
  return aiPoweredSolutionsShowcaseFlow();
}

const showcasePrompt = ai.definePrompt({
  name: 'showcasePrompt',
  output: {schema: AiPoweredSolutionsShowcaseOutputSchema},
  prompt: `You are an expert AI assistant tasked with creating a showcase of AI-driven projects for S-Tech Services.

  S-Tech Services specializes in AI-powered full-stack web development and AI-enhanced cross-platform app design.

  Generate a showcase of AI-driven projects that highlights S-Tech Services\' capabilities and the benefits of AI integration. Each project should include a title, a brief description, the technologies used, and the outcome or result.

  Ensure the showcase is diverse and representative of the company\'s expertise.
  Follow the schema.`,
});

const aiPoweredSolutionsShowcaseFlow = ai.defineFlow(
  {
    name: 'aiPoweredSolutionsShowcaseFlow',
    outputSchema: AiPoweredSolutionsShowcaseOutputSchema,
  },
  async () => {
    const {output} = await showcasePrompt();
    return output!;
  }
);
