import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (user?.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { draft, action } = await req.json();
  // action: "save_draft" | "approve"

  const companyPayload = {
    company_name: draft.company_name,
    legal_name: draft.legal_name || null,
    slug: draft.slug,
    website_url: draft.website_url || null,
    short_description: draft.short_description || null,
    long_description: draft.long_description || null,
    company_type: draft.company_type || "unknown",
    headquarters_location: draft.headquarters_location || null,
    state: draft.state || null,
    country: draft.country || "US",
    phone: draft.phone || null,
    support_email: draft.support_email || null,
    confidence_score: draft.confidence_score || null,
    source_notes: draft.source_notes || null,
    verification_status: draft.verification_status || "unverified",
    status: action === "approve" ? "verified" : "pending_review",
    approved_by_user_id: action === "approve" ? user.id : null,
    last_verified_at: action === "approve" ? new Date().toISOString().split("T")[0] : null,
  };

  const company = await base44.asServiceRole.entities.Company.create(companyPayload);

  // Save products if present
  const savedProducts = [];
  if (draft.products && draft.products.length > 0) {
    for (const p of draft.products) {
      const product = await base44.asServiceRole.entities.Product.create({
        company_id: company.id,
        product_name: p.product_name,
        product_type: p.product_type || "other",
        description: p.description || null,
        monthly_cost: p.monthly_cost || null,
        setup_fee: p.setup_fee || null,
        annual_fee: p.annual_fee || null,
        requires_credit_check: p.requires_credit_check || false,
        requires_ssn: p.requires_ssn || false,
        reporting_frequency: p.reporting_frequency || "unknown",
        reported_limit_min: p.reported_limit_min || null,
        reported_limit_max: p.reported_limit_max || null,
        consumer_or_business: draft.consumer_or_business || "unknown",
        status: action === "approve" ? "verified" : "pending_review",
      });
      savedProducts.push(product);
    }
  }

  return Response.json({ company, products: savedProducts });
});