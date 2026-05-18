Deno.serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL") || Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("VITE_SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    const enableAccessGate = Deno.env.get("VITE_ENABLE_ACCESS_GATE") || "true";
    const superAdminEmails = Deno.env.get("VITE_SUPER_ADMIN_EMAILS") || "";

    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { error: "Supabase config is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Base44 secrets." },
        { status: 500 }
      );
    }

    return Response.json({
      supabaseUrl,
      supabaseAnonKey,
      enableAccessGate,
      superAdminEmails,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});