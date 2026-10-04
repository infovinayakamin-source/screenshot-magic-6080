/**
 * Server-only helper. Loads the privileged backend client and verifies the
 * signed-in caller holds the admin role before handing it back, so every order
 * read or write is gated on the roles table rather than on what the browser
 * claims.
 */
export async function adminClient(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) {
    console.error("Role check failed", error);
    throw new Error("Could not verify access");
  }
  if (!data) throw new Error("Admin access required");
  return supabaseAdmin;
}
