import assert from "node:assert/strict";
import test from "node:test";
import {
  adminReviewSchema,
  deliverySchema,
  diagnosisCreateSchema,
  invoiceConversionSchema,
  paymentRecordSchema,
  quotationApprovalSchema,
  quoteSchema,
  serviceRequestSchema,
  warrantyCreateSchema,
  workflowTransitionSchema
} from "../../src/server/validation";

test("core workflow payloads validate from service request through warranty", () => {
  const request = serviceRequestSchema.parse({
    name: "Green Valley Lodge",
    email: "ops@example.com",
    phone: "+263770000000",
    organization: "Green Valley Lodge",
    serviceId: "svc_starlink",
    title: "Starlink installation",
    description: "We need a Starlink installation with router placement and handover notes.",
    urgency: "NORMAL"
  });
  assert.equal(request.title, "Starlink installation");

  const review = adminReviewSchema.parse({
    requestId: "req_123",
    jobType: "STARLINK_INSTALLATION",
    appointment: {
      startsAt: "2026-06-01T08:00:00.000Z",
      endsAt: "2026-06-01T11:00:00.000Z",
      location: "Borrowdale, Harare"
    }
  });
  assert.equal(review.jobType, "STARLINK_INSTALLATION");

  assert.equal(workflowTransitionSchema.parse({ toStatus: "DIAGNOSING" }).toStatus, "DIAGNOSING");

  const diagnosis = diagnosisCreateSchema.parse({
    symptoms: "Intermittent connectivity and poor Wi-Fi coverage.",
    findings: "Router placement is poor and the dish requires clear-sky positioning.",
    recommendation: "Install roof mount, route cable and configure router.",
    estimatedCost: 150,
    estimatedHours: 3
  });
  assert.equal(diagnosis.final, true);

  const quote = quoteSchema.parse({
    customerId: "cus_123",
    jobCardId: "job_123",
    status: "SENT",
    discount: 0,
    tax: 0,
    lineItems: [{ itemType: "SERVICE", description: "Starlink installation labour", quantity: 1, unitPrice: 150 }]
  });
  assert.equal(quote.lineItems.length, 1);

  assert.equal(quotationApprovalSchema.parse({ decision: "ACCEPTED" }).decision, "ACCEPTED");
  assert.equal(workflowTransitionSchema.parse({ toStatus: "IN_PROGRESS" }).toStatus, "IN_PROGRESS");
  assert.equal(workflowTransitionSchema.parse({ toStatus: "QUALITY_CHECK" }).toStatus, "QUALITY_CHECK");
  assert.equal(workflowTransitionSchema.parse({ toStatus: "COMPLETED" }).toStatus, "COMPLETED");
  assert.equal(invoiceConversionSchema.parse({ dueAt: "2026-06-15" }).dueAt, "2026-06-15");
  assert.equal(paymentRecordSchema.parse({ invoiceId: "inv_123", amount: 150, method: "BANK_TRANSFER" }).method, "BANK_TRANSFER");
  assert.equal(deliverySchema.parse({ mode: "COLLECTION" }).mode, "COLLECTION");
  assert.equal(warrantyCreateSchema.parse({ coverage: "Installation workmanship", endsAt: "2026-09-01T00:00:00.000Z" }).coverage, "Installation workmanship");
});
