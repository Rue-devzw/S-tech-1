import type { Metadata } from "next";
import { PageShell } from "@/components/site-shell";
import { CustomerPortal } from "@/components/customer/customer-portal";
import { currentUser } from "@/server/auth";
import { makeMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Customer Portal",
  description: "Customer portal for service requests, repair tracking, quotations, invoices, warranty claims, installation bookings, messages and ratings.",
  path: "/customer",
  noIndex: true
});

export default async function CustomerPortalPage() {
  const user = await currentUser();

  return (
    <PageShell>
      <CustomerPortal customerName={user?.name ?? "Customer"} />
    </PageShell>
  );
}
