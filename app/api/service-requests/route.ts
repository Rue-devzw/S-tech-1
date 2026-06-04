import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createServiceRequest } from "@/server/services/requests";

export async function POST(request: Request) {
  try {
    const serviceRequest = await createServiceRequest(await request.json());
    return NextResponse.json(
      {
        request: {
          id: serviceRequest.id,
          requestNumber: serviceRequest.requestNumber,
          status: serviceRequest.status
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Please check the service request details.", details: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Could not submit service request." }, { status: 500 });
  }
}
