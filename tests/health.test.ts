import assert from "node:assert/strict";
import { test } from "node:test";
import { GET } from "@/app/api/health/route";

test("health returns an uncached liveness response with no service details", async () => {
  const response = GET();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "application/json");
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { status: "ok" });
});
