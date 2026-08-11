import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductAdminManager } from "@/components/admin/product-admin-manager";
import { PageShell } from "@/components/site-shell";
import { makeMetadata } from "@/lib/seo";
import { prisma } from "@/server/db";
import { requirePermission } from "@/server/rbac";

export const dynamic = "force-dynamic";

export const metadata: Metadata = makeMetadata({
  title: "Product Catalogue",
  description: "Manage OmniTech store products, pricing, stock, publishing and local product photography.",
  path: "/admin/products",
  noIndex: true
});

export default async function AdminProductsPage() {
  const actor = await requirePermission("products:manage");
  if (!actor) redirect("/admin");

  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
  });

  return (
    <PageShell>
      <ProductAdminManager
        initialProducts={products.map((product) => ({
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString()
        }))}
      />
    </PageShell>
  );
}
