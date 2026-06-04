# Admin User Manual

This manual is for Super Admins, Managers, Admin Assistants, Sales/Marketing users and Viewer/Auditors.

## Admin Access

1. Go to `/login`.
2. Sign in with an authorised staff account.
3. The admin dashboard is available at `/admin`.

Development seed login:

- `admin@omnitech.example`
- `OmniTech#2026`

Replace seed credentials before launch.

## Role Summary

| Role | Main Purpose |
| --- | --- |
| Super Admin | Full platform control, settings and security oversight. |
| Manager | Operational oversight, approvals, reports and service performance. |
| Admin Assistant | Intake, job cards, customer support and daily operations. |
| Sales/Marketing | Leads, quotations, promotions, content and campaigns. |
| Viewer/Auditor | Read-only oversight for reporting and audit review. |

## Dashboard

Use `/admin` to monitor:

- New service requests.
- Active and overdue jobs.
- Jobs awaiting quotation or customer approval.
- Field visits today.
- Low stock alerts.
- Monthly revenue.
- Service category performance.
- Campaign enquiries.
- Warranty claims.
- Customer satisfaction.

Use filters for date, service category, technician and job status when reviewing workloads.

## Service Request Intake

1. Open the request queue.
2. Review customer name, phone, service, urgency, location and description.
3. Confirm the request is legitimate and complete.
4. Contact the customer if details are missing.
5. Create a job card through the review workflow.

Good intake notes should capture the customer problem, urgency, device/site context and preferred communication channel.

## Job Cards

Job-card lifecycle:

`request submitted -> admin review -> job card created -> device received or field appointment booked -> diagnosis -> quotation -> customer approval -> parts allocation -> repair/installation -> testing -> completion -> payment -> delivery/collection -> warranty`

Admin responsibilities:

- Assign technician or field installer.
- Capture device or site details.
- Ensure status transitions match real work.
- Keep internal notes professional and factual.
- Confirm customer approval before paid work.
- Confirm payment before delivery/collection where policy requires it.

## Quotations, Invoices and Receipts

Quotations:

- Create draft line items for labour, parts, service fees, discounts and tax-ready fields.
- Set expiry date.
- Send quotation only after checking customer, totals and scope.
- Track customer approval or rejection.

Invoices:

- Convert approved quotations to invoices.
- Confirm invoice status and payment status.
- Record payment method and provider reference.
- Generate receipt after payment.

Do not edit financial records casually after issuing customer documents. Use notes and audit trail for corrections.

## Inventory

Use inventory to track parts and consumables:

- SKU, name, category and supplier.
- Quantity on hand.
- Reorder level.
- Unit cost and selling price.
- Stock movements for purchases, reservations, consumption, adjustments and returns.

Low-stock alerts should be reviewed daily.

## Field Service

Use field-service views for:

- Starlink-related installation support.
- Networking installations.
- Onsite computer support.
- CCTV/network support.
- Business ICT maintenance.

Before assigning a visit, confirm:

- Customer/site address.
- Site contact and phone.
- Technician/installer availability.
- Required tools, parts and access notes.
- Travel notes and appointment time.

After the visit, review evidence, checklist completion, outcome and follow-up task.

## Communications

The communications module supports templates, triggers, logs and manual messages for email, SMS-ready and WhatsApp-ready workflows.

Automated triggers include:

- Request received.
- Job created.
- Diagnosis complete.
- Quotation sent.
- Quotation approved.
- Parts ordered.
- Repair in progress.
- Ready for collection.
- Invoice issued.
- Payment received.
- Warranty expiring.
- Follow-up reminder.

Customer-facing messages must be clear, polite and accurate. Do not promise exact completion times unless confirmed.

## Promotions, Portfolio and Blog

Sales/Marketing users can manage:

- Promotions and campaigns.
- Portfolio projects.
- Testimonials.
- Blog/knowledge centre posts.
- AI-assisted advert drafts.

Privacy rules:

- Publish client names only with permission.
- Use anonymized sector labels when privacy is required.
- Avoid showing exact locations unless approved.
- Do not claim official Starlink partnership unless explicitly configured later.

## AI Assistant

AI functions include enquiry assistance, diagnostics support, quotation wording, reports, advert copy, FAQs, troubleshooting and management summaries.

Rules:

- Treat customer-facing AI output as a draft.
- Review and approve before sending.
- Do not paste passwords, API keys or sensitive secrets into prompts.
- Validate technical recommendations before work begins.

## Audit and Security

Admins should monitor:

- Failed login patterns.
- Invitation creation.
- Password reset activity.
- System setting changes.
- Job and invoice status changes.
- AI approval activity.

Immediately escalate suspicious Super Admin, settings or financial activity.

## Daily Admin Checklist

- Review new service requests.
- Assign urgent jobs.
- Check overdue jobs and field visits.
- Review quotations awaiting approval.
- Check low stock.
- Confirm payment and ready-for-collection queues.
- Review failed notifications.
- Follow up warranty claims and customer ratings.
