import type { Metadata } from "next";
import { BlogAdminEditor } from "@/components/blog-admin-editor";
import { PageShell } from "@/components/site-shell";
import { makeMetadata } from "@/lib/seo";

export const metadata: Metadata = makeMetadata({
  title: "Blog Editor",
  description: "Create and publish OmniTech knowledge-centre articles with SEO, tags and service CTAs.",
  path: "/admin/blog",
  noIndex: true
});

export default function AdminBlogPage() {
  return (
    <PageShell>
      <BlogAdminEditor />
    </PageShell>
  );
}
