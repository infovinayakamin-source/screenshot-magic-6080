import { beforeEach, describe, expect, it } from "vitest";
import { checkAdminAccess, claimAdminFor } from "./admin.functions";

/**
 * Tests for the one-time owner claim flow.
 *
 * The real `claim_admin` database function is service-role only, so these
 * tests use a fake client with the same contract the database enforces:
 * the very first claim inserts the admin row and returns true; every claim
 * after that (same user or anyone else) returns false.
 */
function fakeDb() {
  const admins = new Set<string>();
  return {
    admins,
    client: {
      rpc: async (fn: string, args: { _user_id: string; _role?: string }) => {
        if (fn === "claim_admin") {
          if (admins.size > 0) return { data: false, error: null };
          admins.add(args._user_id);
          return { data: true, error: null };
        }
        if (fn === "has_role") return { data: admins.has(args._user_id), error: null };
        throw new Error(`unexpected rpc: ${fn}`);
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            limit: async () => ({
              data: admins.size > 0 ? [{ id: "role-row" }] : [],
              error: null,
            }),
          }),
        }),
      }),
    },
  };
}

let db: ReturnType<typeof fakeDb>;

beforeEach(() => {
  db = fakeDb();
});

describe("admin claim flow", () => {
  it("lets the very first account claim owner access", async () => {
    const before = await checkAdminAccess(db.client, "user-1");
    expect(before).toEqual({ isAdmin: false, adminExists: false });

    const result = await claimAdminFor(db.client, "user-1");
    expect(result.claimed).toBe(true);

    const after = await checkAdminAccess(db.client, "user-1");
    expect(after).toEqual({ isAdmin: true, adminExists: true });
  });

  it("refuses a repeat claim by the same account", async () => {
    const first = await claimAdminFor(db.client, "user-1");
    expect(first.claimed).toBe(true);

    const again = await claimAdminFor(db.client, "user-1");
    expect(again.claimed).toBe(false);
  });

  it("refuses a claim by any other account once an owner exists", async () => {
    await claimAdminFor(db.client, "user-1");

    const second = await claimAdminFor(db.client, "user-2");
    expect(second.claimed).toBe(false);

    const access = await checkAdminAccess(db.client, "user-2");
    expect(access).toEqual({ isAdmin: false, adminExists: true });
  });

  it("blocks the public registration path after the owner claim", async () => {
    // Before the claim, a visitor sees the claim gate (no admin exists).
    const open = await checkAdminAccess(db.client, "visitor");
    expect(open.adminExists).toBe(false);

    await claimAdminFor(db.client, "user-1");

    // After the claim, any new account finds adminExists = true, so the app
    // hides the claim gate and shows "owner access only" instead — and the
    // claim itself is refused even if called directly.
    const closed = await checkAdminAccess(db.client, "late-comer");
    expect(closed.adminExists).toBe(true);
    expect(closed.isAdmin).toBe(false);

    const attempt = await claimAdminFor(db.client, "late-comer");
    expect(attempt.claimed).toBe(false);
  });
});
