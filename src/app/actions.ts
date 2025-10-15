'use server';

import { getRepairQuote, RepairQuoteInput, RepairQuoteOutput } from '@/ai/flows/repair-quote-system';
import { z } from 'zod';

const RepairQuoteSchema = z.object({
  device: z.string().min(3, 'Device type is required.'),
  issue: z.string().min(10, 'Please describe the issue in more detail.'),
});

type RepairQuoteState = {
  message?: string;
  errors?: {
    device?: string[];
    issue?: string[];
  };
  data?: RepairQuoteOutput;
  success: boolean;
};

export async function submitRepairQuote(
  prevState: RepairQuoteState,
  formData: FormData
): Promise<RepairQuoteState> {
  const validatedFields = RepairQuoteSchema.safeParse({
    device: formData.get('device'),
    issue: formData.get('issue'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
      success: false,
    };
  }

  const repairInput: RepairQuoteInput = {
    device: validatedFields.data.device,
    issue: validatedFields.data.issue,
  };

  try {
    const result = await getRepairQuote(repairInput);
    return {
      message: 'Quote generated successfully.',
      data: result,
      success: true,
    };
  } catch (error) {
    console.error('Error getting repair quote:', error);
    return {
      message: 'An unexpected error occurred while generating the quote. Please try again later.',
      success: false,
    };
  }
}
