import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { state, consumer_business, verification_status } = body;

    if (!state) {
      return Response.json({ error: 'state is required' }, { status: 400 });
    }

    // Fetch companies in this state
    const filterObj = { state };
    if (verification_status && verification_status !== 'all') {
      filterObj.verification_status = verification_status;
    }

    const companies = await base44.asServiceRole.entities.Company.filter(filterObj, '-updated_date', 100);

    if (!companies || companies.length === 0) {
      return Response.json({ companies: [], summary: { total: 0, consumer: 0, business: 0, banks_lenders: 0, avg_confidence: 0 } });
    }

    const companyIds = companies.map(c => c.id);

    // Fetch all products for these companies in parallel
    const productPromises = companyIds.map(id =>
      base44.asServiceRole.entities.Product.filter({ company_id: id }, '-updated_date', 50)
        .then(prods => ({ company_id: id, products: prods || [] }))
        .catch(() => ({ company_id: id, products: [] }))
    );
    const productResults = await Promise.all(productPromises);
    const productsByCompany = {};
    for (const r of productResults) {
      productsByCompany[r.company_id] = r.products;
    }

    // Fetch bureau coverage for all products
    const allProducts = productResults.flatMap(r => r.products);
    const allProductIds = allProducts.map(p => p.id);

    const bureauCoverageByProduct = {};
    if (allProductIds.length > 0) {
      const coveragePromises = allProductIds.map(pid =>
        base44.asServiceRole.entities.ProductBureauCoverage.filter({ product_id: pid }, '-updated_date', 10)
          .then(cov => ({ product_id: pid, coverage: cov || [] }))
          .catch(() => ({ product_id: pid, coverage: [] }))
      );
      const coverageResults = await Promise.all(coveragePromises);
      for (const r of coverageResults) {
        bureauCoverageByProduct[r.product_id] = r.coverage;
      }
    }

    // Fetch all bureaus for name lookup
    let bureaus = [];
    try {
      bureaus = await base44.asServiceRole.entities.Bureau.list('-created_date', 50) || [];
    } catch (_) { bureaus = []; }
    const bureauMap = {};
    for (const b of bureaus) {
      bureauMap[b.id] = b;
    }

    // Enrich each company
    const enriched = companies.map(company => {
      const products = productsByCompany[company.id] || [];
      const productCount = products.length;

      // Determine consumer/business from products
      let hasConsumer = false;
      let hasBusiness = false;
      for (const p of products) {
        if (p.consumer_or_business === 'consumer' || p.consumer_or_business === 'both') hasConsumer = true;
        if (p.consumer_or_business === 'business' || p.consumer_or_business === 'both') hasBusiness = true;
      }
      let lane = 'unknown';
      if (hasConsumer && hasBusiness) lane = 'both';
      else if (hasConsumer) lane = 'consumer';
      else if (hasBusiness) lane = 'business';

      // Collect bureau names from all products
      const bureauNames = new Set();
      for (const p of products) {
        const coverage = bureauCoverageByProduct[p.id] || [];
        for (const cov of coverage) {
          if (cov.reporting_status === 'confirmed_reports' || cov.reporting_status === 'likely_reports') {
            const bureau = bureauMap[cov.bureau_id];
            if (bureau) bureauNames.add(bureau.bureau_name);
          }
        }
      }

      return {
        id: company.id,
        company_name: company.company_name,
        company_type: company.company_type,
        verification_status: company.verification_status,
        confidence_score: company.confidence_score,
        state: company.state,
        headquarters_location: company.headquarters_location,
        website_url: company.website_url,
        updated_date: company.updated_date,
        short_description: company.short_description,
        lane,
        product_count: productCount,
        bureau_names: Array.from(bureauNames),
        products: products.slice(0, 5).map(p => ({
          id: p.id,
          product_name: p.product_name,
          product_type: p.product_type,
          consumer_or_business: p.consumer_or_business,
          monthly_cost: p.monthly_cost,
          status: p.status,
        })),
      };
    });

    // Apply consumer/business filter
    let filtered = enriched;
    if (consumer_business && consumer_business !== 'all') {
      filtered = enriched.filter(c =>
        c.lane === consumer_business || c.lane === 'both'
      );
    }

    // Summary metrics
    const total = filtered.length;
    const consumer = filtered.filter(c => c.lane === 'consumer' || c.lane === 'both').length;
    const business = filtered.filter(c => c.lane === 'business' || c.lane === 'both').length;
    const bankLenderTypes = ['bank', 'credit_union', 'mortgage_lender', 'fintech_lender', 'auto_lender', 'commercial_lender', 'student_loan_servicer'];
    const banks_lenders = filtered.filter(c => bankLenderTypes.includes(c.company_type)).length;
    const withScore = filtered.filter(c => c.confidence_score != null);
    const avg_confidence = withScore.length > 0
      ? Math.round(withScore.reduce((sum, c) => sum + c.confidence_score, 0) / withScore.length)
      : null;

    return Response.json({
      companies: filtered,
      summary: { total, consumer, business, banks_lenders, avg_confidence },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});