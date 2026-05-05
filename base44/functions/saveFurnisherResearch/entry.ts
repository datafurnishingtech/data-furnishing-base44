import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { company, products, bureau_coverage } = await req.json();
  if (!company) {
    return Response.json({ error: 'company data is required' }, { status: 400 });
  }

  // Fetch bureaus for ID resolution
  const bureaus = await base44.asServiceRole.entities.Bureau.list();
  const bureauMap = {};
  for (const b of bureaus) {
    if (b.abbr) bureauMap[b.abbr] = b.id;
  }

  // Save company
  const savedCompany = await base44.asServiceRole.entities.Company.create({
    ...company,
    status: 'pending_review',
    verification_status: 'unverified',
  });

  const savedProducts = [];
  const savedCoverage = [];

  // Save products
  for (const product of (products || [])) {
    const saved = await base44.asServiceRole.entities.Product.create({
      ...product,
      company_id: savedCompany.id,
      status: 'pending_review',
    });
    savedProducts.push({ original_name: product.product_name, id: saved.id });
  }

  // Save bureau coverage
  for (const cov of (bureau_coverage || [])) {
    const matchedProduct = savedProducts.find(p => p.original_name === cov.product_name);
    const bureauId = bureauMap[cov.bureau_abbr];
    if (!matchedProduct || !bureauId) continue;

    const saved = await base44.asServiceRole.entities.ProductBureauCoverage.create({
      product_id: matchedProduct.id,
      bureau_id: bureauId,
      company_id: savedCompany.id,
      reporting_status: cov.reporting_status || 'unknown',
      reporting_type: cov.reporting_type || 'unknown',
      confidence_score: cov.confidence_score || null,
    });
    savedCoverage.push(saved.id);
  }

  return Response.json({
    success: true,
    company_id: savedCompany.id,
    products_saved: savedProducts.length,
    coverage_saved: savedCoverage.length,
  });
});