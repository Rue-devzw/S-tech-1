'use server';

/**
 * @fileOverview An AI agent to provide real-time repair quotes.
 *
 * - getRepairQuote - A function that generates a repair quote based on device and issue.
 * - RepairQuoteInput - The input type for the getRepairQuote function.
 * - RepairQuoteOutput - The return type for the getRepairQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RepairQuoteInputSchema = z.object({
  device: z.string().describe('The type of device needing repair (e.g., iPhone 13, Samsung Galaxy S21).'),
  issue: z.string().describe('A detailed description of the issue (e.g., cracked screen, battery not charging).'),
});
export type RepairQuoteInput = z.infer<typeof RepairQuoteInputSchema>;

const RepairQuoteOutputSchema = z.object({
  quote: z.string().describe('A detailed quote for the repair, including parts and labor costs.'),
  estimatedCompletionTime: z.string().describe('The estimated time for the repair to be completed.'),
  likelyParts: z.array(z.string()).describe('A list of parts that are likely required for the repair.'),
});
export type RepairQuoteOutput = z.infer<typeof RepairQuoteOutputSchema>;

export async function getRepairQuote(input: RepairQuoteInput): Promise<RepairQuoteOutput> {
  return repairQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'repairQuotePrompt',
  input: {schema: RepairQuoteInputSchema},
  output: {schema: RepairQuoteOutputSchema},
  prompt: `You are an expert repair technician providing quotes for electronics repairs.

  Based on the device and issue provided, generate a detailed quote, including a breakdown of parts and labor costs. Also, estimate the completion time for the repair and list the parts most likely required.

  Device: {{{device}}}
  Issue: {{{issue}}}

  Respond with a professional tone and ensure the quote is accurate and realistic.
  Consider using a tool if you need current prices for parts.
  Output should be in JSON format and should follow the RepairQuoteOutputSchema definition.`,
});

const repairQuoteFlow = ai.defineFlow(
  {
    name: 'repairQuoteFlow',
    inputSchema: RepairQuoteInputSchema,
    outputSchema: RepairQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

