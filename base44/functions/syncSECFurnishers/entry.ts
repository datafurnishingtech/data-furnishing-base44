import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch existing companies for deduplication
    const existingCompanies = await base44.entities.Company.list('', 1000);
    const existingNames = new Set(existingCompanies.map(c => c.company_name?.toLowerCase()));
    const existingWebsites = new Set(existingCompanies.map(c => c.website_url?.toLowerCase()).filter(Boolean));

    // Fetch SEC company tickers (free public data)
    const tickersResponse = await fetch('https://www.sec.gov/files/company_tickers.json');
    const tickersData = await tickersResponse.json();

    // Transform SEC data to Company schema
    const newCompanies = [];
    const processedNames = new Set();

    for (const ticker of Object.values(tickersData).slice(0, 50)) { // Start with first 50
      const { cik_str, title, exchange } = ticker;
      
      if (!title) continue;

      const companyName = title.trim();
      const lowerName = companyName.toLowerCase();

      // Skip if duplicate name or already processed this batch
      if (existingNames.has(lowerName) || processedNames.has(lowerName)) {
        continue;
      }

      processedNames.add(lowerName);

      // Map SEC data to Company entity
      const company = {
        company_name: companyName,
        legal_name: companyName,
        slug: companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        company_type: inferType(companyName, exchange),
        status: 'pending_review',
        verification_status: 'unverified',
        confidence_score: 60,
        country: 'US',
        source_url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik_str}&type=&dateb=&owner=exclude&count=100`,
      };

      newCompanies.push(company);
    }

    // Bulk create new companies
    if (newCompanies.length > 0) {
      await base44.entities.Company.bulkCreate(newCompanies);
    }

    return Response.json({
      success: true,
      imported: newCompanies.length,
      skipped: Object.values(tickersData).length - newCompanies.length,
      message: `Imported ${newCompanies.length} new furnishers from SEC EDGAR`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Infer company type from name and exchange
function inferType(name, exchange) {
  const lower = name.toLowerCase();
  
  if (lower.includes('bank') || lower.includes('credit union')) return 'bank';
  if (lower.includes('lending') || lower.includes('loan')) return 'fintech_lender';
  if (lower.includes('mortgage') || lower.includes('home loan')) return 'mortgage_lender';
  if (lower.includes('student loan')) return 'student_loan_servicer';
  if (lower.includes('credit')) return 'credit_builder';
  if (lower.includes('auto') || lower.includes('automotive')) return 'auto_lender';
  
  return 'unknown';
}