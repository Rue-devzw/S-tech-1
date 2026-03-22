import { PasswordResetForm } from "@/components/admin/password-reset-form";
import { getAdminPasswordResetRequest } from "@/lib/server/data-store";

export default async function PasswordResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token?.trim();
  const resetRequest = token
    ? await getAdminPasswordResetRequest(token)
    : null;

  return <PasswordResetForm token={token} tokenValid={Boolean(resetRequest)} />;
}
