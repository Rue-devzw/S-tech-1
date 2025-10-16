'use server';

import { getRepairQuote, RepairQuoteInput, RepairQuoteOutput } from '@/ai/flows/repair-quote-system';
import { z } from 'zod';

// --- Repair Quote Action ---

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


// --- Consultation Request Action ---

const ConsultationRequestSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  company: z.string().optional(),
  projectDetails: z.string().min(10, 'Please provide some project details.'),
  preferredDate: z.string().min(1, 'Please select a date.'),
});

type ConsultationState = {
    message: string;
    success: boolean;
    errors?: {
        name?: string[];
        email?: string[];
        projectDetails?: string[];
        preferredDate?: string[];
    }
}

export async function submitConsultationRequest(prevState: ConsultationState, formData: FormData) : Promise<ConsultationState> {
    const validatedFields = ConsultationRequestSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        projectDetails: formData.get('projectDetails'),
        preferredDate: formData.get('preferredDate'),
    });
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check your input.',
            success: false,
        };
    }

    const { name, email, company, projectDetails, preferredDate } = validatedFields.data;
    const recipient = 'info@stechsolutions.com';
    const subject = `New Consultation Request from ${name}`;
    const body = `
        Name: ${name}
        Email: ${email}
        Company: ${company || 'N/A'}
        Preferred Date: ${preferredDate}
        Project Details:
        ${projectDetails}
    `;

    console.log('--- New Consultation Request ---');
    console.log(`Recipient: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('-----------------------------');

    /*
    // TODO: Integrate an email sending service like Resend, SendGrid, or Nodemailer here.
    // Example using Resend:
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // try {
    //   await resend.emails.send({
    //     from: 'onboarding@resend.dev', // Must be a verified domain on Resend
    //     to: recipient,
    //     subject: subject,
    //     text: body,
    //   });
    // } catch (error) {
    //   console.error('Failed to send email:', error);
    //   return {
    //      message: 'There was a problem sending your request. Please try again later.',
    //      success: false,
    //   }
    // }
    */

    return {
        message: 'Your consultation request has been submitted successfully! We will get back to you shortly.',
        success: true,
    }
}
