'use server';

import { z } from 'zod';

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
    };
    data?: {
        name: string;
        email: string;
        company?: string;
        projectDetails: string;
        preferredDate: string;
    };
}

export async function submitConsultationRequest(prevState: ConsultationState, formData: FormData): Promise<ConsultationState> {
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

    // Server-side logging
    console.log('--- New Consultation Request ---');
    console.log(`Name: ${name}, Email: ${email}`);
    console.log('-----------------------------');

    return {
        message: 'Your consultation request has been submitted successfully!',
        success: true,
        data: validatedFields.data
    }
}
