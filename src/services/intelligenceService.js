import { supabase } from "@/lib/supabaseClient";
import { COMPANY_QUALITY_FIELDS, PRODUCT_QUALITY_FIELDS, countFilledFields, getQualityScore } from "@/lib/dataQuality";
import { canonicalStateNameFromDb, expandCompanyStateVariants } from "@/lib/usStates";

/** Full row — profile / detail pages only (includes large JSON columns). */
const COMPANY_SELECT = `
  company_id, company_name, legal_name, slug, website_url, logo_url,
  short_description, long_description, company_type, primary_category_id,
  status, verification_status, confidence_score, headquarters_location,
  country, state, phone, support_email, contact_page_url, pricing_page_url,
  application_url, source_url, source_notes, last_verified_at, last_crawled_at,
  created_at, updated_at, domain, canonical_url, furnisher_status, entity_type, lane,
  detected_bureaus, reporting_capabilities, api_available, partner_program,
  research_score, reason, source_evidence_title, source_evidence_snippet,
  raw_tradline_info, enrichment_status, crawl_status, crawl_source_urls,
  evidence_sources, enrichment_data, data_completeness_score, reporting_relationship,
  pricing_public, requirements_public
`;

/** Lean columns for paginated registry lists — much faster over the wire. */
const COMPANY_LIST_SELECT = `
  company_id, company_name, legal_name, slug, website_url, logo_url,
  short_description, company_type, verification_status, confidence_score,
  headquarters_location, country, state, domain, furnisher_status, entity_type, lane,
  detected_bureaus, reporting_capabilities, api_available, partner_program,
  data_completeness_score, reporting_relationship, last_verified_at, updated_at
`;

const PRODUCT_SELECT = `
  product_id, company_id, product_name, product_slug, product_type,
  consumer_or_business, description, eligibility_summary, pricing_summary,
  monthly_cost, setup_fee, annual_fee, reported_limit_min, reported_limit_max,
  reporting_speed, reporting_frequency, account_type_reported, payment_required,
  requires_credit_check, requires_business_entity, requires_ein, requires_ssn,
  requires_bank_connection, requires_landlord_participation, requires_property_manager,
  affiliate_available, marketplace_available, apply_url, status, confidence_score,
  source_url, last_verified_at, bureaus_reported, reporting_relationship,
  credit_check_type, requires_personal_guarantee, identifier_requirement,
  min_credit_score, credit_score_notes, time_in_business_months_min,
  annual_revenue_min, deposit_required, deposit_amount_min, secured_amount_min,
  minimum_account_age_months, approval_requirements_json, bureau_reporting_details,
  source_evidence, extraction_notes, data_completeness_score, pricing_public,
  requirements_public, created_at, updated_at
`;

const PRODUCT_LIST_SELECT = `
  product_id, company_id, product_name, product_slug, product_type,
  consumer_or_business, description, confidence_score, reporting_frequency,
  bureaus_reported, reporting_relationship, data_completeness_score,
  last_verified_at, updated_at, apply_url, status
`;

const COMPANY_EMBED_SELECT = `
  company_id, company_name, slug, website_url, domain, logo_url,
  short_description, legal_name, company_type, verification_status,
  confidence_score, headquarters_location, country, state
`;

const COMPANY_MAP_SELECT = `
  company_id, company_name, slug, website_url, domain, logo_url,
  state, company_type, verification_status, confidence_score
`;

function ensureUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function normalizeCompany(company) {
  const website = ensureUrl(company.website_url || company.canonical_url || company.domain);
  return {
    ...company,
    id: company.company_id,
    website_url: website,
    domain: company.domain || website.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, ""),
    filled_fields_count: countFilledFields(company, COMPANY_QUALITY_FIELDS),
    quality_score: getQualityScore(company, COMPANY_QUALITY_FIELDS),
  };
}

function normalizeProduct(product) {
  return {
    ...product,
    id: product.product_id,
    slug: product.product_slug || product.product_id,
    filled_fields_count: countFilledFields(product, PRODUCT_QUALITY_FIELDS),
    quality_score: getQualityScore(product, PRODUCT_QUALITY_FIELDS),
    company: product.companies ? normalizeCompany(product.companies) : null,
  };
}

function withCompletenessOrdering(query) {
  return query
    .order("data_completeness_score", { ascending: false, nullsFirst: false })
    .order("confidence_score", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false, nullsFirst: false });
}

function escapeIlike(term) {
  return String(term || "")
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

function tryParseJson(value) {
  if (value == null) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function safeRpc(functionName, params = undefined) {
  const { data, error } = params === undefined
    ? await supabase.rpc(functionName)
    : await supabase.rpc(functionName, params);
  if (error) {
    const missing = error.code === "PGRST202" || error.message?.includes("Could not find the function");
    if (missing) return { ok: false, data: null, error };
    throw error;
  }
  return { ok: true, data, error: null };
}

export async function listCompaniesPaged({
  page = 1, pageSize = 20, search = "", companyType = "all",
  verificationStatus = "all", state = null,
} = {}) {
  const size = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const p = Math.max(Number(page) || 1, 1);
  const from = (p - 1) * size;
  const to = from + size - 1;
  let q = supabase.from("companies").select(COMPANY_LIST_SELECT, { count: "exact" });
  if (state) {
    const variants = expandCompanyStateVariants(state);
    if (variants?.length) q = q.in("state", variants);
  }
  if (companyType && companyType !== "all") q = q.eq("company_type", companyType);
  if (verificationStatus && verificationStatus !== "all") q = q.eq("verification_status", verificationStatus);
  const term = search.trim();
  if (term) {
    const t = escapeIlike(term);
    q = q.or(`company_name.ilike.%${t}%,legal_name.ilike.%${t}%,short_description.ilike.%${t}%`);
  }
  q = withCompletenessOrdering(q);
  const { data, error, count } = await q.range(from, to);
  if (error) throw error;
  return { rows: (data || []).map(normalizeCompany), total: count ?? 0, page: p, pageSize: size };
}

export async function listProductsPaged({
  page = 1, pageSize = 20, search = "", productType = "all", bureau = "all",
  target = "all", companyId = null, reportingFrequency = "all",
  companyState = null, includeCompanyInSearch = false,
} = {}) {
  const size = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const p = Math.max(Number(page) || 1, 1);
  const from = (p - 1) * size;
  const to = from + size - 1;
  const companyJoin = companyState && expandCompanyStateVariants(companyState)?.length
    ? `companies!inner (${COMPANY_EMBED_SELECT})`
    : `companies (${COMPANY_EMBED_SELECT})`;
  const productFields = companyId
    ? `${PRODUCT_LIST_SELECT}, ${companyJoin}`
    : `${PRODUCT_LIST_SELECT}, ${companyJoin}`;
  let q = supabase.from("products").select(productFields, { count: "exact" });
  if (companyId) q = q.eq("company_id", companyId);
  if (companyState) {
    const variants = expandCompanyStateVariants(companyState);
    if (variants?.length) q = q.in("companies.state", variants);
  }
  if (productType && productType !== "all") q = q.eq("product_type", productType);
  if (target && target !== "all") q = q.eq("consumer_or_business", target);
  if (bureau && bureau !== "all") q = q.contains("bureaus_reported", [bureau]);
  if (reportingFrequency && reportingFrequency !== "all") q = q.eq("reporting_frequency", reportingFrequency);
  const term = search.trim();
  if (term) {
    const t = escapeIlike(term);
    const companyClause = includeCompanyInSearch || companyState
      ? `,companies.company_name.ilike.%${t}%,companies.legal_name.ilike.%${t}%`
      : "";
    q = q.or(`product_name.ilike.%${t}%,description.ilike.%${t}%,product_slug.ilike.%${t}%${companyClause}`);
  }
  q = withCompletenessOrdering(q);
  const { data, error, count } = await q.range(from, to);
  if (error) throw error;
  return { rows: (data || []).map(normalizeProduct), total: count ?? 0, page: p, pageSize: size };
}

export async function getCompanyBySlug(slug) {
  if (!slug) return null;
  let q = supabase.from("companies").select(COMPANY_SELECT);
  const { data: bySlug } = await q.eq("slug", slug).maybeSingle();
  if (bySlug) return normalizeCompany(bySlug);
  const { data: byId } = await supabase.from("companies").select(COMPANY_SELECT).eq("company_id", slug).maybeSingle();
  return byId ? normalizeCompany(byId) : null;
}

export async function getCompanyProductCount(companyId) {
  if (!companyId) return 0;
  const { count, error } = await supabase.from("products").select("product_id", { count: "exact", head: true }).eq("company_id", companyId);
  if (error) return 0;
  return count ?? 0;
}

export async function listProductBureauReporting(productIds) {
  if (!productIds?.length) return [];
  const unique = [...new Set(productIds.filter(Boolean))];
  const chunkSize = 80;
  const all = [];
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("product_bureau_reporting")
      .select("product_id, bureau, bureau_name, reporting_status, reporting_relationship, reporting_type, reporting_frequency, notes")
      .in("product_id", chunk);
    if (error) continue;
    if (data?.length) all.push(...data);
  }
  return all;
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  let q = supabase.from("products").select(`${PRODUCT_SELECT}, companies (${COMPANY_EMBED_SELECT})`);
  const { data: bySlug } = await q.eq("product_slug", slug).maybeSingle();
  if (bySlug) return normalizeProduct(bySlug);
  const { data: byId } = await supabase.from("products")
    .select(`${PRODUCT_SELECT}, companies (${COMPANY_EMBED_SELECT})`)
    .eq("product_id", slug).maybeSingle();
  return byId ? normalizeProduct(byId) : null;
}

export async function getRegistrySummary() {
  const { ok, data } = await safeRpc("get_registry_analytics");
  if (ok && data && typeof data === "object") {
    const payload = typeof data === "string" ? tryParseJson(data) : data;
    if (payload) {
      return {
        companyCount: Number(payload.company_count) || 0,
        productCount: Number(payload.product_count) || 0,
        verifiedCompanyCount: Number(payload.verified_company_count) || 0,
        avgConfidence: Number(payload.avg_confidence) || 0,
        bureauCoveragePct: Number(payload.bureau_coverage_pct) || 0,
      };
    }
  }

  const [companiesRes, productsRes, verifiedRes] = await Promise.all([
    supabase.from("companies").select("company_id", { count: "exact", head: true }),
    supabase.from("products").select("product_id", { count: "exact", head: true }),
    supabase.from("companies").select("company_id", { count: "exact", head: true }).eq("verification_status", "verified"),
  ]);
  return {
    companyCount: companiesRes.count ?? 0,
    productCount: productsRes.count ?? 0,
    verifiedCompanyCount: verifiedRes.count ?? 0,
    avgConfidence: 0,
    bureauCoveragePct: 0,
  };
}

export async function getTopCompaniesByProductCount(limit = 5) {
  const cap = Math.min(Math.max(Number(limit) || 5, 1), 20);
  const { ok, data } = await safeRpc("get_top_companies_by_products", { p_limit: cap });
  if (ok && data) {
    const rows = Array.isArray(data) ? data : tryParseJson(data);
    if (Array.isArray(rows) && rows.length) {
      const ids = rows.map((r) => r.company_id).filter(Boolean);
      const { data: companies } = await supabase
        .from("companies")
        .select(COMPANY_EMBED_SELECT)
        .in("company_id", ids);
      const byId = Object.fromEntries((companies || []).map((c) => [c.company_id, c]));
      return rows.map((r) => ({
        company: normalizeCompany(byId[r.company_id] || { company_id: r.company_id }),
        productCount: Number(r.product_count) || 0,
      }));
    }
  }

  const { data: productRows, error } = await supabase
    .from("products")
    .select(`company_id, companies (${COMPANY_EMBED_SELECT})`);
  if (error || !productRows) return [];
  const counts = {};
  const companiesMap = {};
  for (const row of productRows) {
    const id = row.company_id;
    if (!id) continue;
    counts[id] = (counts[id] || 0) + 1;
    if (row.companies) companiesMap[id] = row.companies;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, cap)
    .map(([id, count]) => ({ company: normalizeCompany(companiesMap[id] || { company_id: id }), productCount: count }));
}

export async function getProductTypeHistogram() {
  const { ok, data } = await safeRpc("get_product_type_histogram");
  if (ok && data && typeof data === "object") {
    const hist = typeof data === "string" ? tryParseJson(data) : data;
    if (hist && !Array.isArray(hist)) {
      const out = {};
      for (const [k, v] of Object.entries(hist)) {
        out[k] = Number(v) || 0;
      }
      return out;
    }
  }

  const { data: typeRows, error } = await supabase
    .from("products")
    .select("product_type")
    .not("product_type", "is", null);
  if (error || !typeRows) return {};
  const hist = {};
  for (const row of typeRows) {
    const t = row.product_type;
    if (t) hist[t] = (hist[t] || 0) + 1;
  }
  return hist;
}

export async function getProductCount() {
  const { count } = await supabase.from("products").select("product_id", { count: "exact", head: true });
  return count ?? 0;
}

export async function getCompanyCount() {
  const { count } = await supabase.from("companies").select("company_id", { count: "exact", head: true });
  return count ?? 0;
}

export async function getCompanyStateCountsMap(companyType = "all") {
  const typeArg = companyType && companyType !== "all" ? companyType : null;
  const { ok, data } = await safeRpc("get_company_state_counts", typeArg ? { p_company_type: typeArg } : undefined);
  if (ok && data) {
    const out = {};
    const parsed = Array.isArray(data) ? data : tryParseJson(data);
    const rows = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? Object.values(parsed) : [];
    for (const row of rows) {
      const key = row.state || row.company_state || row.key || row.name;
      const cnt = row.count ?? row.cnt ?? row.value ?? 1;
      if (!key) continue;
      const canon = canonicalStateNameFromDb(String(key));
      if (!canon) continue;
      out[canon] = (out[canon] || 0) + Number(cnt);
    }
    return out;
  }
  // Fallback: client-side aggregation
  const tally = {};
  let from = 0;
  const pageSize = 1000;
  while (true) {
    let q = supabase.from("companies").select("state").not("state", "is", null).neq("state", "");
    if (typeArg) q = q.eq("company_type", typeArg);
    const { data: rows2, error } = await q.range(from, from + pageSize - 1);
    if (error) throw error;
    if (!rows2?.length) break;
    for (const row of rows2) {
      const canon = canonicalStateNameFromDb(row.state);
      if (!canon) continue;
      tally[canon] = (tally[canon] || 0) + 1;
    }
    if (rows2.length < pageSize) break;
    from += pageSize;
  }
  return tally;
}