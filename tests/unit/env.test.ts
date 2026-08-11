import assert from "node:assert/strict";
import test from "node:test";
import { ensureDatabaseUrlEnv, resolveDatabaseUrl } from "../../src/server/env";

test("database URL resolution keeps local development explicit", () => {
  const previous = { ...process.env };
  try {
    delete process.env.VERCEL;
    process.env.DATABASE_URL = "postgresql://local@localhost:5434/omnitech";
    process.env.omnitech_DATABASE_URL = "postgresql://hosted@database.example/omnitech";
    assert.equal(resolveDatabaseUrl(), process.env.DATABASE_URL);
  } finally {
    process.env = previous;
  }
});

test("Vercel prefers the hosted integration URL over a stale localhost URL", () => {
  const previous = { ...process.env };
  try {
    process.env.VERCEL = "1";
    process.env.DATABASE_URL = "postgresql://local@localhost:5434/omnitech";
    process.env.omnitech_DATABASE_URL = "postgresql://hosted@database.example/omnitech";
    assert.equal(ensureDatabaseUrlEnv(), process.env.omnitech_DATABASE_URL);
  } finally {
    process.env = previous;
  }
});
