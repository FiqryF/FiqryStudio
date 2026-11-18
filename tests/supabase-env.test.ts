import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSupabaseEnv } from "@/lib/validations/supabase-env";

const url = "https://example.supabase.co";
const publishableKey = "sb_publishable_test_fixture";

test("Supabase is optional when both settings are blank", () => {
  assert.equal(parseSupabaseEnv({}), null);
  assert.equal(parseSupabaseEnv({ url: " ", publishableKey: "" }), null);
});

test("Supabase accepts a publishable key and a project origin", () => {
  assert.deepEqual(parseSupabaseEnv({ url: ` ${url} `, publishableKey }), {
    url,
    publishableKey,
  });
  assert.ok(
    parseSupabaseEnv({ url: "http://127.0.0.1:54321", publishableKey }),
  );
});

test("Supabase rejects incomplete settings and invalid project origins", () => {
  assert.throws(() => parseSupabaseEnv({ url }), /NEXT_PUBLIC_SUPABASE_URL/);
  assert.throws(() => parseSupabaseEnv({ publishableKey }), /project URL/);

  for (const invalidUrl of [
    "invalid url",
    "ftp://example.supabase.co",
    "http://example.supabase.co",
    "https://user:pass@example.supabase.co",
    "https://example.supabase.co/rest/v1",
  ]) {
    assert.throws(
      () => parseSupabaseEnv({ url: invalidUrl, publishableKey }),
      /project URL/,
    );
  }
});

test("Supabase rejects privileged keys without echoing their values", () => {
  const secret = "sb_secret_test_fixture";

  assert.throws(
    () => parseSupabaseEnv({ url, publishableKey: secret }),
    (error: unknown) =>
      error instanceof Error &&
      error.message.includes("publishable key") &&
      !error.message.includes(secret),
  );
});
