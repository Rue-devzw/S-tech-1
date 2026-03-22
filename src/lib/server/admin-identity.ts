import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const RECOVERY_CODE_SEGMENTS = 3;
const RECOVERY_CODE_SEGMENT_LENGTH = 4;

function normalizeBase32Secret(secret: string) {
  return secret.toUpperCase().replace(/[^A-Z2-7]/g, "");
}

function base32Encode(buffer: Buffer) {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(secret: string) {
  const normalized = normalizeBase32Secret(secret);
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      continue;
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function leftPadNumber(value: number, length: number) {
  return value.toString().padStart(length, "0");
}

function normalizeVerificationCode(code: string) {
  return code.replace(/\s+/g, "").replace(/-/g, "");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) {
    return false;
  }

  const actualHash = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  if (expectedBuffer.length !== actualHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedBuffer);
}

export function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function generateOpaqueToken() {
  return randomBytes(24).toString("base64url");
}

export function hashOpaqueToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateRecoveryCodes(count = 8) {
  return Array.from({ length: count }, () =>
    Array.from({ length: RECOVERY_CODE_SEGMENTS }, () =>
      randomBytes(RECOVERY_CODE_SEGMENT_LENGTH)
        .toString("hex")
        .slice(0, RECOVERY_CODE_SEGMENT_LENGTH)
        .toUpperCase()
    ).join("-")
  );
}

export function hashRecoveryCode(code: string) {
  return hashOpaqueToken(normalizeVerificationCode(code).toUpperCase());
}

export function generateTotpSecret() {
  return base32Encode(randomBytes(20));
}

export function formatTotpSecret(secret: string) {
  return normalizeBase32Secret(secret).replace(/(.{4})/g, "$1 ").trim();
}

export function createTotpProvisioningUri(input: {
  accountName: string;
  issuer: string;
  secret: string;
}) {
  const accountName = encodeURIComponent(input.accountName);
  const issuer = encodeURIComponent(input.issuer);
  const secret = normalizeBase32Secret(input.secret);
  return `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

function generateTotpCode(secret: string, counter: number) {
  const key = base32Decode(secret);
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));

  const digest = createHmac("sha1", key).update(buffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return leftPadNumber(binary % 1_000_000, 6);
}

export function createCurrentTotpCode(secret: string, timestamp = Date.now()) {
  const timeStep = 30_000;
  const counter = Math.floor(timestamp / timeStep);
  return generateTotpCode(secret, counter);
}

export function verifyTotpCode(input: {
  secret: string;
  code: string;
  window?: number;
  timestamp?: number;
}) {
  const normalizedCode = normalizeVerificationCode(input.code);
  if (!/^\d{6}$/.test(normalizedCode)) {
    return false;
  }

  const timestamp = input.timestamp ?? Date.now();
  const timeStep = 30_000;
  const counter = Math.floor(timestamp / timeStep);
  const window = input.window ?? 1;

  for (let offset = -window; offset <= window; offset += 1) {
    if (generateTotpCode(input.secret, counter + offset) === normalizedCode) {
      return true;
    }
  }

  return false;
}

export function verifyRecoveryCode(input: {
  recoveryCode: string;
  hashedRecoveryCodes: string[];
}) {
  const hashedInput = hashRecoveryCode(input.recoveryCode);
  return input.hashedRecoveryCodes.includes(hashedInput);
}

export function consumeRecoveryCode(input: {
  recoveryCode: string;
  hashedRecoveryCodes: string[];
}) {
  const hashedInput = hashRecoveryCode(input.recoveryCode);
  return input.hashedRecoveryCodes.filter((code) => code !== hashedInput);
}

export function createPasswordResetRecord(input: {
  userId: string;
  expiresInMs: number;
  requestedBy: string;
  metadata?: Record<string, unknown>;
}) {
  const token = generateOpaqueToken();
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    token,
    tokenHash: hashOpaqueToken(token),
    userId: input.userId,
    expiresAt: new Date(Date.now() + input.expiresInMs).toISOString(),
    createdAt: now,
    consumedAt: null as string | null,
    requestedBy: input.requestedBy,
    metadata: input.metadata ?? {},
  };
}

export function createMfaChallengeRecord(input: {
  userId: string;
  expiresInMs: number;
}) {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    userId: input.userId,
    createdAt: now,
    expiresAt: new Date(Date.now() + input.expiresInMs).toISOString(),
    completedAt: null as string | null,
  };
}
