const JUNK_SNIPPET_RE =
  /opens in a new window|close this dialog|cookie|privacy policy\)|manage preferen|skip to content|hs-fs\/hubfs|<!---->|javascript:void/i;

const TECH_KEYS = new Set([
  "meta", "method", "pipeline", "llm_calls", "pages_ok", "run_id",
  "web_result", "web_search_enabled", "existing_db_result", "checked_at",
  "search_results_checked", "has_tradline_data", "matched_terms", "negative_terms",
]);

export function hasDisplayValue(value) {
  if (value == null || value === "") return false;
  if (typeof value === "boolean") return true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

export function ensureUrl(value) {
  if (!value || typeof value !== "string") return "";
  const t = value.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

export function tryParseJson(value) {
  if (value == null || value === "") return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function formatLabel(raw) {
  if (raw == null || raw === "") return "";
  return String(raw)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatBoolean(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return null;
}

/** Strip HTML, boilerplate, and noise from crawled text. */
export function cleanHumanText(value, maxLen = 280) {
  if (value == null || value === "") return "";
  let text = String(value);
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/!\[[^\]]*]\([^)]+\)/g, "");
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
  text = text.replace(/\s+/g, " ").trim();
  if (!text || JUNK_SNIPPET_RE.test(text) && text.length < 120) return "";
  if (text.length > maxLen) text = `${text.slice(0, maxLen).trim()}…`;
  return text;
}

export function isQualityText(text) {
  const cleaned = cleanHumanText(text, 500);
  if (!cleaned || cleaned.length < 24) return false;
  if (JUNK_SNIPPET_RE.test(cleaned)) return false;
  const alpha = (cleaned.match(/[a-zA-Z]/g) || []).length;
  return alpha / cleaned.length > 0.45;
}

function normalizeUrlKey(url) {
  try {
    const u = new URL(ensureUrl(url));
    const host = u.hostname.replace(/^www\./, "").toLowerCase();
    const path = u.pathname.replace(/\/$/, "") || "/";
    return `${host}${path}`;
  } catch {
    return String(url).toLowerCase();
  }
}

function urlLabel(url) {
  try {
    const u = new URL(ensureUrl(url));
    const path = u.pathname === "/" ? "" : u.pathname;
    return `${u.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return url;
  }
}

function categorizeUrl(url) {
  const p = url.toLowerCase();
  if (/\/(apply|application|signup|register|get-started)/.test(p)) return "apply";
  if (/\/(pricing|plans|fees)/.test(p)) return "pricing";
  if (/\/(contact|support|help|faq)/.test(p)) return "support";
  if (/\/(privacy|terms|legal|disclosure)/.test(p)) return "legal";
  if (p.endsWith("/") || !/\/[^/]+/.test(p.replace(/^https?:\/\/[^/]+/, ""))) return "home";
  return "other";
}

/** Dedupe crawl URLs and return a short prioritized list for display. */
export function prioritizeCrawlUrls(value, limit = 8) {
  const raw = normalizeUrlList(value);
  const seen = new Set();
  const byCategory = { home: [], apply: [], pricing: [], support: [], legal: [], other: [] };

  for (const url of raw) {
    const key = normalizeUrlKey(url);
    if (seen.has(key)) continue;
    seen.add(key);
    const cat = categorizeUrl(url);
    byCategory[cat].push(ensureUrl(url));
  }

  const ordered = [
    ...byCategory.home.slice(0, 1),
    ...byCategory.apply.slice(0, 1),
    ...byCategory.pricing.slice(0, 1),
    ...byCategory.support.slice(0, 2),
    ...byCategory.legal.slice(0, 2),
    ...byCategory.other,
  ];

  const unique = [];
  const used = new Set();
  for (const url of ordered) {
    const k = normalizeUrlKey(url);
    if (used.has(k)) continue;
    used.add(k);
    unique.push(url);
    if (unique.length >= limit) break;
  }

  return { urls: unique, total: seen.size };
}

export function normalizeUrlList(value) {
  const parsed = tryParseJson(value);
  const list = Array.isArray(parsed) ? parsed : Array.isArray(value) ? value : [];
  return list
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && item.url) return String(item.url).trim();
      return "";
    })
    .filter(Boolean);
}

export function normalizeEvidenceSources(value) {
  const parsed = tryParseJson(value);
  const list = Array.isArray(parsed) ? parsed : Array.isArray(value) ? value : [];
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const url = item.url || item.source_url || item.link;
      const title = cleanHumanText(item.title || item.source_evidence_title || "", 120);
      const snippet = cleanHumanText(item.snippet || item.source_evidence_snippet || "", 220);
      if (!url && !title && !snippet) return null;
      return { url: url ? ensureUrl(url) : "", title, snippet };
    })
    .filter(Boolean);
}

function scoreEvidence(item) {
  let score = 0;
  if (item.title && item.title.length > 8 && !JUNK_SNIPPET_RE.test(item.title)) score += 4;
  if (item.snippet && isQualityText(item.snippet)) score += 5;
  if (item.url) score += 1;
  if (item.title?.toLowerCase().includes("joined self")) score -= 2;
  return score;
}

/** Return top N evidence items with readable content only. */
export function pickBestEvidence(value, max = 3) {
  return normalizeEvidenceSources(value)
    .filter((e) => scoreEvidence(e) >= 4 && (e.title || isQualityText(e.snippet)))
    .sort((a, b) => scoreEvidence(b) - scoreEvidence(a))
    .slice(0, max);
}

/** Human-readable tradeline summary — no raw JSON blobs. */
export function extractTradelineSummary(rawTradeline) {
  const obj = tryParseJson(rawTradeline);
  if (!obj || typeof obj !== "object") return [];

  const rows = [];
  const push = (label, val) => {
    const text = typeof val === "string" ? val.trim() : val != null ? String(val) : "";
    if (!text || text === "true" || text === "false") return;
    rows.push({ label, value: text });
  };

  push("Consumer / business lane", formatLabel(obj.lane));
  push("Tradeline status", formatLabel(obj.status));

  const db = obj.existing_db_result || obj.source;
  if (db && typeof db === "object") {
    if (db.confidence != null) push("Confidence", `${db.confidence}%`);
    const src = db.source || db;
    if (src?.title) push("Primary source", cleanHumanText(src.title, 100));
    if (src?.snippet && isQualityText(src.snippet)) {
      push("Source summary", cleanHumanText(src.snippet, 200));
    }
    if (Array.isArray(db.matched_terms) && db.matched_terms.length) {
      push("Matched terms", db.matched_terms.slice(0, 6).join(", "));
    }
  }

  if (Array.isArray(obj.reasons) && obj.reasons.length) {
    push("Assessment", obj.reasons.slice(0, 3).join(" · "));
  }

  return rows.slice(0, 6);
}

/** Enrichment highlights for humans — excludes pipeline / LLM meta. */
export function extractEnrichmentHighlights(enrichmentData) {
  const obj = tryParseJson(enrichmentData);
  if (!obj || typeof obj !== "object") return [];

  const rows = [];
  const addText = (label, val) => {
    if (val == null || val === "") return;
    if (typeof val === "string") {
      const cleaned = cleanHumanText(val, 400);
      if (cleaned) rows.push({ label, value: cleaned, type: "text" });
      return;
    }
    if (Array.isArray(val)) {
      const items = val
        .map((v) => (typeof v === "string" ? cleanHumanText(v, 200) : null))
        .filter(Boolean);
      if (items.length) rows.push({ label, value: items, type: "list" });
      return;
    }
    if (typeof val === "object") {
      const cleaned = cleanHumanText(JSON.stringify(val), 200);
      if (cleaned && !cleaned.startsWith("{")) rows.push({ label, value: cleaned, type: "text" });
    }
  };

  addText("Requirements", obj.requirements);
  addText("Eligibility", obj.eligibility);
  addText("Reporting", obj.reporting_notes || obj.reporting);
  addText("How to apply", obj.application_process || obj.application);
  addText("Pricing", obj.pricing_notes || obj.pricing);

  if (obj.urls && typeof obj.urls === "object") {
    for (const [key, url] of Object.entries(obj.urls)) {
      if (TECH_KEYS.has(key)) continue;
      if (typeof url === "string" && url.trim()) {
        rows.push({ label: formatLabel(key), value: url.trim(), type: "url" });
      }
    }
  }

  return rows.slice(0, 8);
}

export function sameDomain(urlA, urlB) {
  if (!urlA || !urlB) return false;
  try {
    const a = new URL(ensureUrl(urlA)).hostname.replace(/^www\./, "").toLowerCase();
    const b = new URL(ensureUrl(urlB)).hostname.replace(/^www\./, "").toLowerCase();
    return a === b;
  } catch {
    return false;
  }
}

export function buildPrimaryLinks(company) {
  const website = company.website_url || (company.domain ? ensureUrl(company.domain) : "");
  const links = [];
  const add = (label, href) => {
    const url = ensureUrl(href);
    if (!url) return;
    links.push({ label, url });
  };

  add("Website", website);
  if (!sameDomain(website, company.application_url)) add("Apply", company.application_url);
  if (!sameDomain(website, company.pricing_page_url)) add("Pricing", company.pricing_page_url);
  if (!sameDomain(website, company.contact_page_url)) add("Contact", company.contact_page_url);

  return links;
}
