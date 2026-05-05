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

    // Fetch real data from SEC EDGAR - using direct API endpoint
    const response = await fetch('https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=&type=&dateb=&owner=exclude&count=100&output=json', {
      headers: { 'User-Agent': 'DataFurnisherRegistry/1.0' }
    });

    if (!response.ok) {
      throw new Error(`SEC EDGAR API error: ${response.status}`);
    }

    const edgarData = await response.json();
    const newCompanies = [];
    const processedNames = new Set();

    // Process actual SEC company data
    for (const company of edgarData.companies || []) {
      const companyName = company.title?.trim();
      if (!companyName) continue;

      const lowerName = companyName.toLowerCase();

      // Skip if already exists or processed in this batch
      if (existingNames.has(lowerName) || processedNames.has(lowerName)) {
        continue;
      }

      processedNames.add(lowerName);

      newCompanies.push({
        company_name: companyName,
        legal_name: companyName,
        slug: companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        company_type: inferType(companyName),
        status: 'pending_review',
        verification_status: 'unverified',
        confidence_score: 75,
        country: 'US',
        source_url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${company.cik_str}`,
      });
    }

    // Bulk create new companies
    if (newCompanies.length > 0) {
      await base44.entities.Company.bulkCreate(newCompanies);
    }

    return Response.json({
      success: true,
      imported: newCompanies.length,
      skipped: (edgarData.companies?.length || 0) - newCompanies.length,
      message: `Imported ${newCompanies.length} new furnishers from SEC EDGAR`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Infer company type from name
function inferType(name) {
  const lower = name.toLowerCase();
  
  if (lower.includes('bank') || lower.includes('credit union')) return 'bank';
  if (lower.includes('lending') || lower.includes('loan')) return 'fintech_lender';
  if (lower.includes('mortgage')) return 'mortgage_lender';
  if (lower.includes('student')) return 'student_loan_servicer';
  if (lower.includes('credit')) return 'credit_builder';
  if (lower.includes('auto')) return 'auto_lender';
  
  return 'unknown';
}