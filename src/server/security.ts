const sensitiveKeyPattern = /(password|passcode|secret|token|api[_-]?key|authorization|credential|private[_-]?key|customerPasswordNote)/i;

type RateLimitState = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, RateLimitState>();

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function rateLimit(request: Request, scope: string, limit: number, windowMs: number): RateLimitResult {
  if (process.env.RATE_LIMIT_DISABLED === "true") {
    return { ok: true, remaining: limit, resetAt: Date.now() + windowMs, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  const key = `${scope}:${getClientIp(request)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: Math.max(0, limit - 1), resetAt, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
  if (existing.count > limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt, retryAfterSeconds };
  }

  return { ok: true, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt, retryAfterSeconds: 0 };
}

export function redactSensitiveText(value: string) {
  return value
    .replace(/([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})/gi, "[redacted-email]")
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "[redacted-phone]")
    .replace(/\b(password|passcode|secret|token|api[_ -]?key|authorization)\s*[:=]\s*([^\s,;]+)/gi, "$1=[redacted]")
    .replace(/\b(sk-[A-Za-z0-9_-]{16,}|pk_[A-Za-z0-9_-]{16,}|[A-Za-z0-9_-]{32,})\b/g, "[redacted-token]");
}

export function redactContext<T>(value: T): T {
  if (typeof value === "string") return redactSensitiveText(value) as T;
  if (Array.isArray(value)) return value.map((item) => redactContext(item)) as T;
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      sensitiveKeyPattern.test(key) ? "[redacted]" : redactContext(item)
    ])
  ) as T;
}

export function wasRedacted(original: string, redacted: string) {
  return original !== redacted;
}
