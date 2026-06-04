# OmniTech Solutions UI/UX Design System

Brand promise: **We repair. We connect. We build. We automate.**

Design tone: modern, trustworthy, technical, clean and premium. The interface should feel competent and calm: good for a customer requesting a phone repair, and equally good for an admin managing Starlink installations, inventory and invoices.

## Design Principles

- **Operational clarity:** every workflow should make the next action obvious.
- **Trust through restraint:** use clean layouts, strong contrast, precise language and visible status feedback.
- **Technical but human:** show structured data without making the interface feel cold.
- **Mobile-first intake:** customers and technicians should complete core tasks easily on phones.
- **Admin efficiency:** dashboards should support scanning, filtering and repeated daily use.
- **Brand consistency:** every major surface should reinforce repair, connectivity, building and automation.

## Colour Palette

### Core Brand

| Token | Hex | Use |
|---|---:|---|
| `ink` | `#18212F` | Primary text, nav, admin sidebar, premium surfaces |
| `teal` | `#0F766E` | Primary actions, success, connectivity, links |
| `copper` | `#B86432` | Accent actions, promotions, warnings, repair energy |
| `cloud` | `#F5F7FB` | App background, dashboard canvas |
| `line` | `#DCE3EE` | Borders, dividers, table lines |
| `white` | `#FFFFFF` | Cards, forms, public content panels |

### Supporting Colours

| Token | Hex | Use |
|---|---:|---|
| `slate-900` | `#0F172A` | High-emphasis text |
| `slate-700` | `#334155` | Body text |
| `slate-500` | `#64748B` | Muted metadata |
| `blue` | `#2563EB` | Informational states |
| `green` | `#15803D` | Completed, paid, active |
| `amber` | `#B45309` | Pending, waiting parts |
| `red` | `#B91C1C` | Errors, overdue, failed |

### Usage Rules

- Use `ink` and white for premium contrast.
- Use `teal` for the main CTA across public and app surfaces.
- Use `copper` sparingly for secondary emphasis, promotions and high-priority operational cues.
- Avoid heavy gradients and decorative colour effects.
- Dashboard pages should remain mostly neutral, with colour used for meaning.

## Typography

Recommended font stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Type Scale

| Style | Size | Line Height | Weight | Use |
|---|---:|---:|---:|---|
| Display | 48px | 56px | 700 | Public homepage H1 only |
| Page title | 36px | 44px | 700 | Page headers |
| Section title | 24px | 32px | 650 | Dashboard sections |
| Card title | 18px | 28px | 650 | Cards and panels |
| Body | 16px | 26px | 400 | Main readable text |
| Small | 14px | 22px | 400/600 | Tables, forms, metadata |
| Caption | 12px | 18px | 600 | Badges, labels, compact metadata |

Rules:

- Do not scale typography with viewport width.
- Keep letter spacing at `0`.
- Use sentence case for labels and buttons.
- Use plain, action-oriented copy: “Create quote”, “Assign technician”, “Send update”.

## Spacing

Base unit: `4px`.

| Token | Value | Use |
|---|---:|---|
| `space-1` | 4px | Icon gaps, tight metadata |
| `space-2` | 8px | Badge padding, compact gaps |
| `space-3` | 12px | Form element gaps |
| `space-4` | 16px | Card padding mobile, table cells |
| `space-5` | 20px | Standard panel padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Page layout gaps |
| `space-10` | 40px | Public sections |
| `space-14` | 56px | Hero/large section padding |

Layout:

- Public pages: max width `1280px`, horizontal padding `16px` mobile, `24px` tablet, `32px` desktop.
- Admin pages: fixed sidebar on desktop, top mobile nav, content max width only where readability matters.
- Forms: one column on mobile, two columns only where labels remain readable.

## Radius, Borders and Shadows

| Token | Value | Use |
|---|---:|---|
| `radius-sm` | 4px | Badges, compact controls |
| `radius-md` | 6px | Buttons, inputs |
| `radius-lg` | 8px | Cards, panels, modals |

Rules:

- Cards should not exceed `8px` radius.
- Use borders before shadows in operational UI.
- Use shadow only for modals, floating menus and important public cards.

## Buttons

### Primary Button

Use for the main action on a screen.

```text
Background: ink or teal
Text: white
Height: 44px desktop, 48px mobile
Padding: 16px horizontal
Radius: 6px
Font: 14px / 600
```

Examples:

- Start service request
- Create job card
- Send quotation
- Save changes

### Secondary Button

```text
Background: white
Border: line
Text: ink
```

Use for alternate actions like “Preview”, “Cancel”, “View details”.

### Destructive Button

```text
Background: red
Text: white
```

Use only for irreversible or high-risk actions.

### Icon Buttons

Use familiar icons for:

- Edit
- Delete
- Download
- Send
- Search
- Filter
- Calendar
- More actions

Rules:

- Icon-only buttons require accessible labels/tooltips.
- Disabled buttons must explain why when possible.
- Avoid multiple primary buttons in one panel.

## Cards and Panels

### Public Cards

Use for service categories, portfolio items, testimonials and promotions.

```text
Background: white
Border: line
Radius: 8px
Padding: 20px
Title: 18px / 650
Body: 14px / 22px
```

### Admin Panels

Use for grouped operational content.

```text
Background: white
Border: line
Radius: 8px
Header: 16px / 650
Padding: 16px-20px
```

Rules:

- Do not nest cards inside cards.
- Use panels for grouped dashboards, not decorative page sections.
- Repeated cards should have consistent heights where practical.

## Forms

Fields:

```text
Height: 44px minimum
Radius: 6px
Border: line
Focus ring: teal
Label: 14px / 600
Helper text: 13px / slate-500
Error text: 13px / red
```

Required form behaviour:

- Validate client-side for usability.
- Validate server-side for security.
- Preserve user input after errors.
- Show field-level errors, not only page-level errors.
- Use specific labels: “Device serial number”, not “Serial”.
- Group long forms into sections.

Important form sections:

- Customer details
- Service details
- Device/site details
- Diagnosis
- Quote items
- Invoice/payment details
- Warranty terms

## Tables

Use tables for admin operations, inventory, invoices, customers and audit logs.

```text
Header background: cloud
Header text: 12px / 700 / uppercase optional
Cell text: 14px
Row height: 52px minimum
Border: line
Hover: cloud
```

Required table features:

- Search
- Filters
- Sort for key columns
- Pagination
- Empty state
- Row actions menu
- Mobile fallback to stacked list/cards

Common columns:

- Reference number
- Customer
- Service/category
- Status
- Priority
- Assigned user
- Updated date
- Amount
- Actions

## Dashboard Widgets

### Metric Widget

Use for high-level KPIs.

Examples:

- New requests
- Open jobs
- Quote pipeline
- Outstanding invoices
- Low-stock items
- Jobs due today

Structure:

```text
Label
Value
Delta or note
Optional icon
```

### Work Queue Widget

Use for actionable queues.

- New service requests
- Jobs waiting for parts
- Quotes awaiting approval
- Invoices overdue
- Today’s field visits

Each row should include:

- Reference
- Customer
- Status/priority
- Age or scheduled time
- Primary action

### Chart Widget

Use charts sparingly.

Good charts:

- Requests by service category
- Job status distribution
- Monthly revenue
- Quote acceptance rate
- Technician workload

Avoid decorative charts without decisions attached.

## Status Badges

Badges should be compact, readable and colour-coded by meaning.

| Status Type | Colour |
|---|---|
| New / Draft | Slate |
| Triaged / Assigned | Blue |
| Approved / Active | Teal |
| In progress | Blue |
| Waiting parts / Pending | Amber |
| Ready | Teal |
| Completed / Paid | Green |
| Failed / Overdue / Cancelled | Red |

Badge style:

```text
Radius: 999px
Padding: 4px 10px
Font: 12px / 600
Background: light tint
Text: dark semantic colour
```

## Empty States

Empty states should be helpful, not cute.

Structure:

1. Short title
2. One-sentence explanation
3. Primary action when relevant

Examples:

- “No service requests yet”
- “No jobs assigned today”
- “No inventory alerts”
- “No quotations awaiting approval”

Tone:

- Clear
- Calm
- Actionable

## Error States

Use three levels:

### Field Error

Shown directly under invalid input.

Example: “Enter a valid phone number.”

### Panel Error

Shown inside a dashboard widget when data fails to load.

Example: “Could not load today’s appointments. Try again.”

### Page Error

Used for full-screen failures.

Example: “We could not load this job card.”

Rules:

- Do not expose stack traces.
- Provide retry actions.
- Log server errors.
- Keep customer-facing error messages plain.

## Loading States

Use loading states that preserve layout.

- Buttons: replace label with “Saving…” or “Submitting…”.
- Tables: skeleton rows.
- Cards: skeleton blocks.
- Dashboards: metric skeletons.
- Full page: only for initial route loads.

Avoid spinners as the only loading indicator for data-heavy admin screens.

## Mobile Navigation

Public mobile nav:

- Sticky header
- Logo/brand
- Menu icon
- Primary CTA: “Request service”
- Drawer links: Services, Portfolio, Knowledge, Promotions, Portal, Contact

Customer mobile nav:

- Bottom navigation for Portal, Requests, Quotes, Invoices, Support
- Keep request status visible on detail pages.

Technician mobile nav:

- Today
- Jobs
- Schedule
- Parts
- Account

Rules:

- Touch targets must be at least `44px`.
- Avoid dense tables on mobile.
- Convert work queues into stacked task cards.

## Admin Sidebar

Desktop admin sidebar groups:

```text
Overview
  Dashboard
  Reports

Operations
  Service requests
  Job cards
  Schedule
  Field visits

Customers
  CRM
  Devices
  Warranties

Billing
  Quotations
  Invoices
  Payments
  Receipts

Stock
  Inventory
  Suppliers
  Stock movements

Growth
  Promotions
  Portfolio
  Testimonials
  Blog
  FAQs

Automation
  AI assistant
  Notifications
  Message templates

System
  Users and roles
  Settings
  Audit logs
```

Sidebar rules:

- Use icons plus labels.
- Collapse to icons at medium widths only if tooltips exist.
- Highlight active section clearly.
- Keep destructive/admin-only areas visually separated.

## Public Website Header

Header contents:

- OmniTech Solutions logo
- Tagline visible on desktop: “We repair. We connect. We build. We automate.”
- Navigation: Services, Request, Portfolio, Knowledge, Promotions, Portal
- Primary CTA: “Book service”

Header behaviour:

- Sticky on scroll.
- White background with subtle border.
- Mobile drawer below `1024px`.

## Public Website Footer

Footer sections:

- Brand summary
- Contact details
- Service categories
- Customer links
- Business links
- Social/contact channels

Required footer copy:

```text
OmniTech Solutions
We repair. We connect. We build. We automate.
```

Footer should feel operational and credible, not oversized or decorative.

## Accessibility Rules

Minimum requirements:

- WCAG 2.1 AA contrast.
- Keyboard navigable menus, dialogs and forms.
- Visible focus states.
- Labels for every input.
- Accessible names for icon buttons.
- Do not rely on colour alone for status.
- Form errors must be announced or placed near fields.
- Tables need proper headers.
- Modals must trap focus and restore focus on close.
- Text must not overlap or truncate critical information.
- Touch targets must be at least `44px` on mobile.

Content accessibility:

- Use plain language.
- Avoid unexplained technical jargon for customers.
- Provide confirmation after submissions.
- Use exact status names consistently.

## Component Inventory

Core components:

- `Button`
- `IconButton`
- `Badge`
- `StatusBadge`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `Switch`
- `DatePicker`
- `Card`
- `Panel`
- `MetricCard`
- `DataTable`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `Toast`
- `Modal`
- `Drawer`
- `Sidebar`
- `PublicHeader`
- `PublicFooter`
- `AdminShell`
- `CustomerShell`
- `TechnicianShell`

## Example Screen Patterns

### Public Homepage

- First viewport shows brand name, tagline, service request CTA and service pillars.
- Avoid marketing-only copy; lead users toward action.
- Show service categories early.

### Admin Dashboard

- Top row: metrics.
- Middle: service request queue and jobs due today.
- Right/secondary: stock alerts, overdue invoices, notification failures.
- Bottom: audit/recent activity.

### Job Card Detail

- Header: job number, customer, status, priority.
- Main tabs: Overview, Diagnosis, Quote, Parts, Evidence, Warranty, Timeline.
- Sidebar: assigned technician, schedule, contact, key timestamps.

### Customer Portal

- Summary of active requests and jobs.
- Quote approval actions.
- Invoice/payment history.
- Warranty records.
- Support CTA.

## Tailwind Token Mapping

Recommended Tailwind extension:

```ts
colors: {
  ink: "#18212F",
  teal: "#0F766E",
  copper: "#B86432",
  cloud: "#F5F7FB",
  line: "#DCE3EE",
  success: "#15803D",
  info: "#2563EB",
  warning: "#B45309",
  danger: "#B91C1C"
}
```

Border radius:

```ts
borderRadius: {
  sm: "4px",
  md: "6px",
  lg: "8px"
}
```

Shadow:

```ts
boxShadow: {
  soft: "0 18px 55px rgba(24, 33, 47, 0.12)"
}
```

## Quality Checklist

Before shipping any OmniTech UI:

- Does the screen support repair, connectivity, building or automation work?
- Is the primary action obvious?
- Can a non-technical admin use it?
- Does mobile work without cramped tables?
- Are statuses visible and understandable?
- Are errors specific and recoverable?
- Is access controlled server-side?
- Does the screen feel like OmniTech: clean, technical, trustworthy and premium?
