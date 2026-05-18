# Supabase migrations

Apply SQL in the Supabase Dashboard → **SQL** → New query → Run. Use **oldest timestamp first**.

**Performance (required for fast lists, heatmap, overview):** run the full file:

`supabase/migrations/20260517000000_performance_indexes_and_rpcs.sql`

This adds GIN/trigram indexes, list-sort indexes, and RPCs: `get_registry_analytics`, `get_company_state_counts`, `get_top_companies_by_products`, `get_product_type_histogram`. Safe to re-run (`IF NOT EXISTS` / `CREATE OR REPLACE`).

Older migrations from `datafurnishing_backend/supabase/migrations/` (when present) should be applied before the performance file if those objects are not already in your project.

Expected objects:

- Tables: `profiles`, `admin_audit_logs`, `companies`, `products`, `product_bureau_reporting`
- Functions: `is_admin()`, `bootstrap_my_admin_profile()`, `admin_list_profiles()`, `admin_profile_stats()`, `get_company_state_counts()`, `get_registry_analytics()`, `get_top_companies_by_products()`, `get_product_type_histogram()`
- Trigger: `handle_new_user_profile` on `auth.users`

Verify:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles','companies','products','product_bureau_reporting','admin_audit_logs');

SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE 'admin_%' OR routine_name LIKE 'get_%' OR routine_name = 'is_admin');
```
