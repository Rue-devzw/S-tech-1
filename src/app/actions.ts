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


const ConsultationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  projectDetails: z.string().min(20, { message: "Please provide more details about your project." }),
  preferredDate: z.coerce.date({
    required_error: "A preferred date is required.",
  }),
});

type ConsultationFormState = {
    message: string;
    errors?: {
        name?: string[];
        email?: string[];
        company?: string[];
        projectDetails?: string[];
        preferredDate?: string[];
    };
    success: boolean;
}

export async function submitConsultationRequest(
    prevState: ConsultationFormState,
    formData: FormData
): Promise<ConsultationFormState> {
    const validatedFields = ConsultationFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        projectDetails: formData.get('projectDetails'),
        preferredDate: formData.get('preferredDate'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed. Please check the form and try again.',
            success: false,
        };
    }

    const { name, email, company, projectDetails, preferredDate } = validatedFields.data;

    try {
        // ** EMAIL SENDING LOGIC WOULD GO HERE **
        // Example using a service like Resend or Nodemailer:
        //
        // await resend.emails.send({
        //   from: 'onboarding@resend.dev',
        //   to: 'info@s-techsolutions.org',
        //   subject: `New Consultation Request from ${name}`,
        //   html: `<p>Name: ${name}</p>
        //          <p>Email: ${email}</p>
        //          <p>Company: ${company || 'N/A'}</p>
        //          <p>Date: ${preferredDate.toDateString()}</p>
        //          <p>Details: ${projectDetails}</p>`
        // });

        console.log('--- New Consultation Request ---');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Company:', company);
        console.log('Preferred Date:', preferredDate.toDateString());
        console.log('Project Details:', projectDetails);
        console.log('---------------------------------');
        
        return {
            message: "Thank you! We've received your request and will be in touch shortly.",
            success: true,
        };

    } catch (error) {
        console.error('Error submitting consultation request:', error);
        return {
            message: 'An unexpected error occurred. Please try again later.',
            success: false,
        };
    }
}
