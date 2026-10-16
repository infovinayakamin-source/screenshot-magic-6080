import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMiddleware } from "@tanstack/react-start";

/**
 * Tests for the one-time owner claim flow.
 *
 * The real `claim_admin` database function is service-role only, so these
 * tests mock the backend client with the same contract the database enforces:
 * the very first claim inserts the admin row and returns true; every claim
 * after that (same user or anyone else) returns false.
 */
const state = {
  admins: new Set<string>(),
  currentUser: "user-1",
};

// Server functions expect a TanStack Start request context; in tests there is
// none, so provide a minimal one with no global function middleware.
vi.mock("@tanstack/start-storage-context", () => ({
  getStartContext: () => ({ startOptions: { functionMiddleware: [] } }),
  createStartContext: () => ({}),
  createNullStartContext: () => ({}),
}));

vi.mock("@/integrations/supabase/auth-middleware", () => ({
  requireSupabaseAuth: createMiddleware().server(({ next }) =>
    next({ context: { userId: state.currentUser } }),
  ),
}));

vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    rpc: vi.fn(async (fn: string, args: { _user_id: string }) => {
      if (fn === "claim_admin") {
        if (state.admins.size > 0) return { data: false, error: null };
        state.admins.add(args._user_id);
        return { data: true, error: null };
      }
      if (fn === "has_role") {
        return { data: state.admins.has(args._user_id), error: null };
      }
      throw new Error(`unexpected rpc: ${fn}`);
    }),
    from: vi.fn(() => ({
      select: () => ({
        eq: () => ({
          limit: async () => ({
            data: state.admins.size > 0 ? [{ id: "role-row" }] : [],
            error: null,
          }),
        }),
      }),
    })),
  },
}));

import { claimAdminAccess, getAdminAccess } from "./admin.functions";

beforeEach(() => {
  state.admins.clear();
  state.currentUser = "user-1";
});

describe("admin claim flow", () => {
  it("lets the very first account claim owner access", async () => {
    const before = await getAdminAccess({ data: {} });
    expect(before).toEqual({ isAdmin: false, adminExists: false });

    const result = await claimAdminAccess({ data: {} });
    expect(result.claimed).toBe(true);

    const after = await getAdminAccess({ data: {} });
    expect(after).toEqual({ isAdmin: true, adminExists: true });
  });

  it("refuses a repeat claim by the same account", async () => {
    const first = await claimAdminAccess({ data: {} });
    expect(first.claimed).toBe(true);

    const again = await claimAdminAccess({ data: {} });
    expect(again.claimed).toBe(false);
  });

  it("refuses a claim by any other account once an owner exists", async () => {
    await claimAdminAccess({ data: {} });

    state.currentUser = "user-2";
    const second = await claimAdminAccess({ data: {} });
    expect(second.claimed).toBe(false);

    const access = await getAdminAccess({ data: {} });
    expect(access).toEqual({ isAdmin: false, adminExists: true });
  });

  it("blocks the public registration path after the owner claim", async () => {
    // Before the claim, a visitor sees the claim gate (no admin exists).
    const open = await getAdminAccess({ data: {} });
    expect(open.adminExists).toBe(false);

    await claimAdminAccess({ data: {} });

    // After the claim, any new account finds adminExists = true, so the app
    // hides the claim gate and shows "owner access only" instead — and the
    // claim itself is refused even if called directly.
    state.currentUser = "late-comer";
    const closed = await getAdminAccess({ data: {} });
    expect(closed.adminExists).toBe(true);
    expect(closed.isAdmin).toBe(false);

    const attempt = await claimAdminAccess({ data: {} });
    expect(attempt.claimed).toBe(false);
  });
});
