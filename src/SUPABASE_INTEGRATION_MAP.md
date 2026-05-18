# Supabase integration map (Base44 UI — zero frontend edits)

Integration is **additive**: Vite aliases swap auth, API client, and auth-page modules at build time. Original files under `src/pages/`, `src/components/`, `src/lib/AuthContext.jsx`, and `src/api/base44Client.js` are unchanged on disk.

## Runtime wiring

| Layer | File | Role |
|-------|------|------|
| Entry | `src/main-supabase.jsx` | Wraps `App` with `SupabaseQueryProvider` |
| Vite | `vite.plugins/supabaseIntegration.js` | Aliases + HTML entry → `main-supabase.jsx` |
| Auth | `src/lib/auth/AuthContext.supabase.jsx` | Supabase session, profiles, approval gate |
| Data API | `src/api/base44Client.supabase.js` | Patches `base44.auth.*` and `base44.entities.*` |
| Bridge | `src/lib/supabaseDataBridge.js` | Base44-shaped rows from Supabase tables/RPCs |
| Services | `src/services/intelligenceService.js`, `profileService.js`, `adminService.js` | Direct Supabase queries |

## Overview page (bridge: `Overview.supabase.jsx`)

| UI element | Source |
|------------|--------|
| Stat cards | `getRegistrySummary()` |
| Top furnishers | `getTopCompaniesByProductCount(5)` |
| Product mix pie | `getProductTypeHistogram()` |
| Heatmap | `companies` via `Company.list()` bridge |
| Recent trade activity | `listProductsPaged({ pageSize: 5 })` |
| Alerts / watchlists | Static (no table yet) |

## Furnishers page

| UI element | Source |
|------------|--------|
| Company list | `base44.entities.Company.list()` → `listCompaniesPaged()` |
| Company detail products | `Product.filter({ company_id })` → `listProductsPaged()` |
| Bureau coverage per product | `ProductBureauCoverage.filter({ product_id })` → `product_bureau_reporting` |
| Header stats (if added) | `getRegistrySummary()` |

## Tradelines page (bridge: `Tradelines.supabase.jsx`)

| UI element | Source |
|------------|--------|
| Tradeline list + detail | `listProductsPaged()` |
| Stat cards | `getProductCount()` + live rows |

## Bureau coverage page (bridge: `BureauCoverage.supabase.jsx`)

| UI element | Source |
|------------|--------|
| BureauComparisonTable | `Bureau.list()` + `ProductBureauCoverage.list()` |
| Furnisher directory | `listProductsPaged()` + company join |
| Stat cards | `getCompanyCount()` / `getProductCount()` |

## Auth pages (bridge copies only)

| Route | Bridge file | Backend |
|-------|-------------|---------|
| `/auth-login` | `src/bridges/pages/AuthLogin.supabase.jsx` | `supabase.auth.signInWithPassword` |
| `/auth-register` | `src/bridges/pages/AuthRegister.supabase.jsx` | `supabase.auth.signUp` + `profiles` row |
| `/auth-forgot` | `src/bridges/pages/AuthForgotPassword.supabase.jsx` | `resetPasswordForEmail` |

## Admin (not in Base44 App routes yet)

| Feature | Service |
|---------|---------|
| User list | `adminService.listProfilesPaged()` → `admin_list_profiles` RPC |
| Stats | `adminService.fetchProfileStats()` |
| Audit log | `adminService.fetchAuditLogs()` |
| Approve / reject | `adminService.approveProfile()` / `rejectProfile()` |

## Entity → table mapping

| Base44 entity | Supabase | Bridge notes |
|---------------|----------|--------------|
| Company | `public.companies` | `company_id` → `id` |
| Product | `public.products` | `product_id` → `id` |
| ProductBureauCoverage | `public.product_bureau_reporting` | `bureau` → `bureau_id` slug |
| Bureau | `public.bureaus` or canonical list | Fallback canonical bureaus if table empty |
| Category / Tags / UserList | — | Still static |

## Environment

See `.env.local.example`. Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPER_ADMIN_EMAILS` (optional)
- `VITE_ENABLE_ACCESS_GATE` (`false` disables approval gate in dev)

## Local dev

```bash
cd data-furnishing-base44
npm install
npm run dev
```

Open http://localhost:5173 — sign in at `/auth-login` with a Supabase Auth user (super-admin emails auto-approve).
