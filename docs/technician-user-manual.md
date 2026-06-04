# Technician User Manual

This manual is for Technicians and Field Installers using OmniTech Solutions.

## Technician Access

1. Go to `/login`.
2. Sign in with your staff account.
3. Open `/technician`.

Development seed login:

- `tech@omnitech.example`
- `OmniTech#2026`

## What Technicians Can See

Technicians can access assigned technical work:

- Assigned jobs.
- Diagnosis queue.
- Customer fault description.
- Device photos and condition notes.
- Required parts.
- Repair notes.
- Testing checklist.
- Due dates.
- Status update buttons.

Technicians should not see sensitive finance, admin settings or unrelated customer records unless authorised.

## Assigned Jobs

For each assigned job, review:

- Job number.
- Customer fault description.
- Device or site details.
- Accessories received.
- Condition photos.
- Priority and due date.
- Current status.
- Internal notes.

If a job appears incorrect or incomplete, contact the admin team before starting work.

## Device Intake Review

Before diagnosis:

- Confirm the device matches the job card.
- Check make, model, serial/IMEI where available.
- Review condition notes and photos.
- Confirm accessories received.
- Note any missing charger, remote, cables, SIM tray or other items.
- Add a note if the condition differs from intake records.

## Diagnosis Workflow

A good diagnosis includes:

- Symptoms observed.
- Tests performed.
- Findings.
- Likely cause.
- Recommended repair or next step.
- Parts required.
- Labour estimate.
- Risks and limitations.

Avoid unsupported certainty. If a fault is intermittent, record it as intermittent and describe how it was tested.

## Repair Notes

Repair notes should be factual and readable by another technician:

- What was inspected.
- What was replaced or repaired.
- What parts were used.
- What settings or configurations changed.
- What remains unresolved.
- What customer advice is needed.

Do not store customer passwords in repair notes. Use approved secure password handling procedures.

## Status Updates

Use statuses accurately:

- `DIAGNOSING`: actively checking the fault.
- `QUOTED`: diagnosis done and quotation prepared/sent.
- `APPROVED`: customer approved quoted work.
- `WAITING_PARTS`: parts required before work continues.
- `IN_PROGRESS`: repair or installation underway.
- `QUALITY_CHECK`: testing completed work.
- `READY_FOR_COLLECTION`: bench repair is ready.
- `READY_FOR_DELIVERY`: delivery is required.
- `COMPLETED`: work is closed.
- `CANCELLED`: work will not continue.

Do not skip approval-related statuses when paid work requires customer consent.

## Parts Handling

When parts are required:

- Add required part names and quantities.
- Link inventory item when available.
- Mark whether each part is required or optional.
- Record estimated cost if known.
- Wait for approval and allocation before consuming stock.

Never use a part without recording it against the job.

## Testing Checklist

Before marking work complete:

- Confirm the original fault is resolved or documented.
- Test power, charging, display, keyboard/input, sound/video, network and relevant ports.
- For software work, confirm boot, user profile, updates and basic app functionality.
- For TV/electronics, confirm safety and sustained operation where practical.
- For field/networking work, confirm signal, connectivity, cable routing and handover.

Attach notes where a test cannot be performed.

## Field Installation Workflow

For Starlink, networking, onsite support, CCTV/network support and ICT maintenance:

- Review appointment time and location.
- Confirm site contact.
- Review travel/access notes.
- Capture field photos where required.
- Complete installation checklist.
- Record router/network configuration notes where relevant.
- Capture customer signature placeholder/name where required.
- Record visit outcome and follow-up tasks.

For Starlink-related services, use independent service wording. Do not claim official Starlink partnership.

## AI Technician Assistant

Use AI for:

- Troubleshooting checklist ideas.
- Diagnostic structure.
- Service report drafts.
- Internal summaries.

Do not paste customer passwords, private keys, API keys or sensitive secrets into AI prompts. Treat AI suggestions as support, not final authority.

## Escalation

Escalate to a Manager/Admin when:

- Repair cost is likely to exceed approved scope.
- Customer data risk is present.
- Device shows unsafe electrical damage.
- Parts are unavailable or unsuitable.
- Job is overdue.
- Customer disputes condition or diagnosis.
- Warranty claim may require management decision.

## End-of-Day Checklist

- Update every job worked on today.
- Add diagnosis or repair notes.
- Record required parts.
- Complete checklists.
- Upload/record evidence where applicable.
- Move statuses forward only when true.
- Flag blockers to admin.
