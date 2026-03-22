"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const mfaRequired = Boolean(challengeId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          mfaRequired
            ? {
                challengeId,
                mfaCode,
              }
            : {
                username,
                password,
              }
        ),
      });

      if (response.status === 202) {
        const data = (await response.json()) as {
          challengeId?: string;
          mfaRequired?: boolean;
        };

        if (!data.mfaRequired || !data.challengeId) {
          throw new Error("Unable to start the MFA challenge.");
        }

        setChallengeId(data.challengeId);
        setMfaCode("");
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to sign in.");
      }

      router.push(nextPath);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to sign in."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetChallenge() {
    setChallengeId(null);
    setMfaCode("");
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md border-white/10 bg-slate-900 text-white shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Secure Access
            </p>
            <CardTitle className="mt-2 text-3xl font-headline font-semibold text-white">
              Admin Login
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-200">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="border-slate-700 bg-slate-950 text-white"
                disabled={mfaRequired}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-slate-700 bg-slate-950 text-white"
                disabled={mfaRequired}
              />
            </div>
            {mfaRequired ? (
              <div className="space-y-2">
                <Label htmlFor="mfa-code" className="text-slate-200">
                  Authentication Code
                </Label>
                <Input
                  id="mfa-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={mfaCode}
                  onChange={(event) => setMfaCode(event.target.value)}
                  className="border-slate-700 bg-slate-950 text-white"
                  placeholder="123456 or recovery code"
                />
                <p className="text-xs text-slate-400">
                  Enter the 6-digit code from your authenticator app or one of
                  your recovery codes.
                </p>
              </div>
            ) : null}
            {error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              {submitting
                ? mfaRequired
                  ? "Verifying..."
                  : "Signing in..."
                : mfaRequired
                  ? "Verify and continue"
                  : "Sign in to admin"}
            </Button>
            {mfaRequired ? (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={resetChallenge}
              >
                Use a different account
              </Button>
            ) : null}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Authenticator-based MFA is supported.</span>
              <Link
                href="/login/reset"
                className="text-cyan-300 hover:text-cyan-200"
              >
                Forgot password?
              </Link>
            </div>
            <p className="text-center text-xs text-slate-400">
              The initial owner account is seeded from <code>.env.local</code>.
              Additional admin users are managed inside the platform.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
