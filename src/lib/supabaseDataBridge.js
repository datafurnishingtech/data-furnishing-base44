import { supabase } from "@/lib/supabaseClient";
import {
  listCompaniesPaged,
  listProductsPaged,
  listProductBureauReporting,
  getRegistrySummary,
  getTopCompaniesByProductCount,
  getProductTypeHistogram,
  getCompanyStateCountsMap,
} from "@/services/intelligenceService";

const CANONICAL_BUREAUS = [
  { id: "experian", bureau_name: "Experian", abbr: "EX", bureau_type: "consumer", status: "active" },
  { id: "equifax", bureau_name: "Equifax", abbr: "EQ", bureau_type: "consumer", status: "active" },
  { id: "transunion", bureau_name: "TransUnion", abbr: "TU", bureau_type: "consumer", status: "active" },
  { id: "innovis", bureau_name: "Innovis", abbr: "IN", bureau_type: "consumer", status: "active" },
  { id: "sbfe", bureau_name: "SBFE", abbr: "SB", bureau_type: "business", status: "active" },
  { id: "experian_small_business", bureau_name: "Experian Small Business", abbr: "ESB", bureau_type: "business", status: "active" },
  { id: "dun_bradstreet", bureau_name: "Dun & Bradstreet", abbr: "D&B", bureau_type: "business", status: "active" },
];

const bureauNameToId = new Map();
for (const b of CANONICAL_BUREAUS) {
  bureauNameToId.set(b.bureau_name.toLowerCase(), b.id);
  bureauNameToId.set(b.abbr.toLowerCase(), b.id);
  bureauNameToId.set(b.id, b.id);
}
bureauNameToId.set("trans union", "transunion");
bureauNameToId.set("d&b", "dun_bradstreet");

function slugifyBureau(value) {
  if (!value) return "unknown";
  const key = String(value).trim().toLowerCase();
  if (bureauNameToId.has(key)) return bureauNameToId.get(key);
  return key.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "unknown";
}

function mapCoverageRow(row) {
  const bureauLabel = row.bureau_name || row.bureau || "";
  const bureauId = slugifyBureau(bureauLabel);
  return {
    id: `${row.product_id}-${bureauId}`,
    product_id: row.product_id,
    bureau_id: bureauId,
    company_id: row.company_id || null,
    reporting_status: row.reporting_status || "unknown",
    reporting_type: row.reporting_type || "unknown",
    account_classification: row.account_classification || "unknown",
    notes: row.notes || null,
    created_date: row.created_at || null,
    updated_date: row.updated_at || null,
  };
}

function mapCompanyRow(row) {
  if (!row) return row;
  const state = row.state;
  const abbrev =
    state && state.length === 2
      ? state.toUpperCase()
      : state;
  return {
    ...row,
    id: row.id || row.company_id,
    created_date: row.created_at,
    updated_date: row.updated_at,
    state: abbrev,
  };
}

function mapProductRow(row) {
  if (!row) return row;
  return {
    ...row,
    id: row.id || row.product_id,
    created_date: row.created_at,
    updated_date: row.updated_at,
  };
}

export async function listCompanies(sort, limit = 500) {
  const result = await listCompaniesPaged({ page: 1, pageSize: limit });
  return (result.rows || []).map(mapCompanyRow);
}

export async function filterCompanies(filterObj = {}, sort, limit = 100) {
  const result = await listCompaniesPaged({
    page: 1,
    pageSize: limit,
    search: filterObj.search || "",
    companyType: filterObj.company_type || "all",
    verificationStatus: filterObj.verification_status || "all",
    state: filterObj.state || null,
  });
  let rows = (result.rows || []).map(mapCompanyRow);
  if (filterObj.company_id) {
    rows = rows.filter((c) => c.id === filterObj.company_id || c.company_id === filterObj.company_id);
  }
  return rows;
}

export async function listProducts(sort, limit = 500) {
  const result = await listProductsPaged({ page: 1, pageSize: limit });
  return (result.rows || []).map(mapProductRow);
}

export async function filterProducts(filterObj = {}, sort, limit = 100) {
  const result = await listProductsPaged({
    page: 1,
    pageSize: limit,
    companyId: filterObj.company_id || null,
  });
  return (result.rows || []).map(mapProductRow);
}

export async function filterProductBureauCoverage(filterObj = {}, sort, limit = 50) {
  if (!filterObj.product_id) return [];
  const rows = await listProductBureauReporting([filterObj.product_id]);
  return rows.map(mapCoverageRow).slice(0, limit);
}

let coverageCache = null;
let coverageCacheAt = 0;

export async function listProductBureauCoverageAll(limit = 2000) {
  const now = Date.now();
  if (coverageCache && now - coverageCacheAt < 60_000) {
    return coverageCache.slice(0, limit);
  }
  const { data: products, error } = await supabase
    .from("products")
    .select("product_id")
    .limit(Math.min(limit, 2000));
  if (error) throw error;
  const ids = (products || []).map((p) => p.product_id).filter(Boolean);
  if (!ids.length) return [];
  const rows = await listProductBureauReporting(ids);
  coverageCache = rows.map(mapCoverageRow);
  coverageCacheAt = now;
  return coverageCache.slice(0, limit);
}

export async function listBureaus(sort, limit = 250) {
  const { data, error } = await supabase.from("bureaus").select("*").limit(limit);
  if (!error && data?.length) {
    return data.map((b) => ({
      ...b,
      id: b.id || slugifyBureau(b.bureau_name),
    }));
  }
  return CANONICAL_BUREAUS.slice(0, limit);
}

export {
  getRegistrySummary,
  getTopCompaniesByProductCount,
  getProductTypeHistogram,
  getCompanyStateCountsMap,
};
