import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all companies and products
    const [companies, products] = await Promise.all([
      base44.entities.Company.list('-created_date', 500),
      base44.entities.Product.list('-created_date', 500),
    ]);

    // Audit companies
    const companiesWithoutWebsite = companies.filter(c => !c.website_url);
    const companiesWithoutHeadquarters = companies.filter(c => !c.headquarters_location);
    const companiesWithoutBoth = companies.filter(c => !c.website_url && !c.headquarters_location);

    // Audit products - check for orphaned records
    const companyIds = new Set(companies.map(c => c.id));
    const orphanedProducts = products.filter(p => !companyIds.has(p.company_id));

    // Products by company
    const productsByCompany = {};
    companies.forEach(c => {
      productsByCompany[c.id] = products.filter(p => p.company_id === c.id).length;
    });

    // Confidence score distribution
    const confidenceDistribution = {
      high: companies.filter(c => c.confidence_score >= 80).length,
      medium: companies.filter(c => c.confidence_score >= 60 && c.confidence_score < 80).length,
      low: companies.filter(c => c.confidence_score < 60).length,
      missing: companies.filter(c => !c.confidence_score).length,
    };

    // Verification status distribution
    const verificationDistribution = {
      verified: companies.filter(c => c.verification_status === 'verified').length,
      partially_verified: companies.filter(c => c.verification_status === 'partially_verified').length,
      unverified: companies.filter(c => c.verification_status === 'unverified').length,
    };

    return Response.json({
      audit_timestamp: new Date().toISOString(),
      summary: {
        total_companies: companies.length,
        total_products: products.length,
      },
      company_data_quality: {
        missing_website_url: {
          count: companiesWithoutWebsite.length,
          percentage: Math.round((companiesWithoutWebsite.length / companies.length) * 100),
          examples: companiesWithoutWebsite.slice(0, 5).map(c => ({ id: c.id, name: c.company_name })),
        },
        missing_headquarters_location: {
          count: companiesWithoutHeadquarters.length,
          percentage: Math.round((companiesWithoutHeadquarters.length / companies.length) * 100),
          examples: companiesWithoutHeadquarters.slice(0, 5).map(c => ({ id: c.id, name: c.company_name })),
        },
        missing_both: {
          count: companiesWithoutBoth.length,
          percentage: Math.round((companiesWithoutBoth.length / companies.length) * 100),
        },
      },
      product_foreign_key_integrity: {
        total_products: products.length,
        orphaned_products: {
          count: orphanedProducts.length,
          examples: orphanedProducts.slice(0, 5).map(p => ({ id: p.id, name: p.product_name, company_id: p.company_id })),
        },
        companies_with_no_products: {
          count: Object.values(productsByCompany).filter(count => count === 0).length,
          examples: companies.filter(c => productsByCompany[c.id] === 0).slice(0, 5).map(c => ({ id: c.id, name: c.company_name })),
        },
      },
      data_quality_scores: {
        confidence_score_distribution: confidenceDistribution,
        verification_status_distribution: verificationDistribution,
      },
      recommendations: [
        companiesWithoutWebsite.length > 0 ? `Populate website_url for ${companiesWithoutWebsite.length} companies` : null,
        companiesWithoutHeadquarters.length > 0 ? `Populate headquarters_location for ${companiesWithoutHeadquarters.length} companies` : null,
        orphanedProducts.length > 0 ? `Fix or delete ${orphanedProducts.length} orphaned products with invalid company_id` : null,
        Object.values(productsByCompany).filter(count => count === 0).length > 0 ? `Create products for companies with no product mappings or verify data integrity` : null,
      ].filter(r => r !== null),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});