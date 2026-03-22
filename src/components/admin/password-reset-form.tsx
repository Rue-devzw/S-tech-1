"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordResetForm({
  token,
  tokenValid,
}: {
  token?: string;
  tokenValid: boolean;
}) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function requestReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/session/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to request a password reset.");
      }

      setMessage(
        "If that admin account exists, a reset link has been sent to its email address."
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to request a password reset."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function completeReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (!token) {
        throw new Error("Missing password reset token.");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const response = await fetch("/api/session/reset", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to reset your password.");
      }

      setMessage(
        "Your password has been updated. You can sign in again with the new password."
      );
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to reset your password."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isCompletionMode = Boolean(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md border-white/10 bg-slate-900 text-white shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
            {isCompletionMode ? (
              <KeyRound className="h-7 w-7" />
            ) : (
              <ShieldCheck className="h-7 w-7" />
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Admin Recovery
            </p>
            <CardTitle className="mt-2 text-3xl font-headline font-semibold text-white">
              {isCompletionMode ? "Choose a new password" : "Reset password"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isCompletionMode ? (
            tokenValid ? (
              <form onSubmit={completeReset} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">
                    New password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="border-slate-700 bg-slate-950 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-slate-200">
                    Confirm password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="border-slate-700 bg-slate-950 text-white"
                  />
                </div>
                {error ? (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                  </p>
                ) : null}
                {message ? (
                  <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                    {message}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                >
                  {submitting ? "Updating password..." : "Update password"}
                </Button>
              </form>
            ) : (
              <div className="space-y-5">
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-3 text-sm text-amber-100">
                  This password reset link is invalid or has expired.
                </p>
                <Button asChild className="w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                  <Link href="/login/reset">Request a new reset link</Link>
                </Button>
              </div>
            )
          ) : (
            <form onSubmit={requestReset} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-slate-200">
                  Username or email
                </Label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="border-slate-700 bg-slate-950 text-white"
                />
              </div>
              {error ? (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {message}
                </p>
              ) : null}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              >
                {submitting ? "Sending reset link..." : "Send reset link"}
              </Button>
            </form>
          )}
          <p className="mt-5 text-center text-xs text-slate-400">
            <Link href="/login" className="text-cyan-300 hover:text-cyan-200">
              Back to admin login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
