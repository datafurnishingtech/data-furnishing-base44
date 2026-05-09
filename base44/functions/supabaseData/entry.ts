import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

async function supabaseQuery(table, params = {}) {
  let url = `${SUPABASE_URL}/${table}`;
  const queryParams = new URLSearchParams();

  if (params.select) queryParams.set("select", params.select);
  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      queryParams.set(key, `eq.${value}`);
    }
  }
  if (params.order) queryParams.set("order", params.order);
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  if (qs) url += `?${qs}`;

  const res = await fetch(url, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error on ${table}: ${err}`);
  }

  return res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { table, filter, order, limit, select } = body;

    if (!["companies", "products"].includes(table)) {
      return Response.json({ error: "Invalid table" }, { status: 400 });
    }

    const rows = await supabaseQuery(table, { select, filter, order, limit });

    // Normalize PK fields so existing UI (which uses .id) continues to work
    const data = rows.map((row) => {
      if (table === "companies" && row.company_id && !row.id) {
        return { ...row, id: row.company_id };
      }
      if (table === "products" && row.product_id && !row.id) {
        return { ...row, id: row.product_id };
      }
      return row;
    });

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});