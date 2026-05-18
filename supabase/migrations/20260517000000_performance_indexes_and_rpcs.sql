-- Performance: indexes + analytics RPCs for Data Furnishing
-- Apply in Supabase SQL Editor (Dashboard → SQL → New query → Run)
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE

-- ---------------------------------------------------------------------------
-- Extensions (fast ILIKE / search)
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- COMPANIES (~2.4k rows, growing)
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_slug ON public.companies (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_company_type ON public.companies (company_type);
CREATE INDEX IF NOT EXISTS idx_companies_verification_status ON public.companies (verification_status);
CREATE INDEX IF NOT EXISTS idx_companies_state ON public.companies (state) WHERE state IS NOT NULL AND state <> '';
CREATE INDEX IF NOT EXISTS idx_companies_domain ON public.companies (domain) WHERE domain IS NOT NULL;

-- Default list sort (registry table)
CREATE INDEX IF NOT EXISTS idx_companies_list_sort ON public.companies (
  data_completeness_score DESC NULLS LAST,
  confidence_score DESC NULLS LAST,
  updated_at DESC NULLS LAST
);

-- Filter combos used together
CREATE INDEX IF NOT EXISTS idx_companies_type_verification ON public.companies (company_type, verification_status);

-- Trigram search (company_name / legal_name / short_description ILIKE)
CREATE INDEX IF NOT EXISTS idx_companies_company_name_trgm ON public.companies USING gin (company_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_companies_legal_name_trgm ON public.companies USING gin (legal_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_companies_short_description_trgm ON public.companies USING gin (short_description gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- PRODUCTS (~5k rows, growing)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_company_id ON public.products (company_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON public.products (product_slug) WHERE product_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_product_type ON public.products (product_type);
CREATE INDEX IF NOT EXISTS idx_products_consumer_or_business ON public.products (consumer_or_business);
CREATE INDEX IF NOT EXISTS idx_products_reporting_frequency ON public.products (reporting_frequency);

CREATE INDEX IF NOT EXISTS idx_products_list_sort ON public.products (
  data_completeness_score DESC NULLS LAST,
  confidence_score DESC NULLS LAST,
  updated_at DESC NULLS LAST
);

CREATE INDEX IF NOT EXISTS idx_products_company_sort ON public.products (
  company_id,
  data_completeness_score DESC NULLS LAST,
  confidence_score DESC NULLS LAST
);

CREATE INDEX IF NOT EXISTS idx_products_bureaus_gin ON public.products USING gin (bureaus_reported);
CREATE INDEX IF NOT EXISTS idx_products_product_name_trgm ON public.products USING gin (product_name gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- PRODUCT BUREAU REPORTING
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_product_bureau_reporting_product_id ON public.product_bureau_reporting (product_id);

-- ---------------------------------------------------------------------------
-- PROFILES / ADMIN
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON public.profiles (approval_status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email_trgm ON public.profiles USING gin (email gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs (created_at DESC);

-- ---------------------------------------------------------------------------
-- RPC: State counts for heatmap (replaces full-table client scan)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_company_state_counts(p_company_type text DEFAULT NULL)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    json_agg(json_build_object('state', state, 'count', cnt) ORDER BY cnt DESC),
    '[]'::json
  )
  FROM (
    SELECT state, COUNT(*)::bigint AS cnt
    FROM companies
    WHERE state IS NOT NULL AND btrim(state) <> ''
      AND (
        p_company_type IS NULL
        OR p_company_type = 'all'
        OR company_type = p_company_type
      )
    GROUP BY state
  ) s;
$$;

GRANT EXECUTE ON FUNCTION public.get_company_state_counts(text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC: Dashboard registry stats (single round-trip)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_registry_analytics()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH bureau AS (
    SELECT
      COUNT(*)::bigint AS total,
      COUNT(*) FILTER (
        WHERE bureaus_reported IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM unnest(bureaus_reported) AS b(val)
            WHERE lower(val::text) LIKE '%equifax%'
          )
          AND EXISTS (
            SELECT 1 FROM unnest(bureaus_reported) AS b(val)
            WHERE lower(val::text) LIKE '%experian%' AND lower(val::text) NOT LIKE '%small%'
          )
          AND EXISTS (
            SELECT 1 FROM unnest(bureaus_reported) AS b(val)
            WHERE lower(val::text) LIKE '%trans%'
          )
      )::bigint AS tri
    FROM products
    WHERE bureaus_reported IS NOT NULL
  )
  SELECT json_build_object(
    'company_count', (SELECT COUNT(*)::bigint FROM companies),
    'product_count', (SELECT COUNT(*)::bigint FROM products),
    'verified_company_count', (
      SELECT COUNT(*)::bigint FROM companies WHERE verification_status = 'verified'
    ),
    'avg_confidence', (
      SELECT COALESCE(ROUND(AVG(confidence_score))::int, 0)
      FROM companies
      WHERE confidence_score IS NOT NULL
    ),
    'bureau_coverage_pct', (
      SELECT CASE WHEN total > 0 THEN ROUND(100.0 * tri / total)::int ELSE 0 END
      FROM bureau
    )
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_registry_analytics() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC: Top furnishers by product count (replaces loading all products client-side)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_top_companies_by_products(p_limit int DEFAULT 5)
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'company_id', company_id,
        'product_count', product_count
      )
      ORDER BY product_count DESC
    ),
    '[]'::json
  )
  FROM (
    SELECT company_id, COUNT(*)::bigint AS product_count
    FROM products
    WHERE company_id IS NOT NULL
    GROUP BY company_id
    ORDER BY product_count DESC
    LIMIT GREATEST(COALESCE(p_limit, 5), 1)
  ) t;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_companies_by_products(int) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC: Product type histogram (replaces loading all product_type values)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_product_type_histogram()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    json_object_agg(product_type, cnt),
    '{}'::json
  )
  FROM (
    SELECT product_type, COUNT(*)::bigint AS cnt
    FROM products
    WHERE product_type IS NOT NULL AND btrim(product_type) <> ''
    GROUP BY product_type
  ) t;
$$;

GRANT EXECUTE ON FUNCTION public.get_product_type_histogram() TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- Analyze tables so the planner uses new indexes
-- ---------------------------------------------------------------------------
ANALYZE public.companies;
ANALYZE public.products;
ANALYZE public.product_bureau_reporting;
ANALYZE public.profiles;
