import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const discoveries = [];
    const errors = [];

    // 1. Fetch CFPB Consumer Reporting Companies list
    try {
      const cfpbResponse = await fetch(
        'https://www.consumerfinance.gov/data-research/consumer-reporting-companies/'
      );
      const cfpbHtml = await cfpbResponse.text();
      
      // Extract company names from CFPB list (simple regex for bureau names)
      const bureauMatches = cfpbHtml.match(
        /<td[^>]*>([^<]*(?:Experian|Equifax|TransUnion|Innovis|Clarity)[^<]*)<\/td>/gi
      ) || [];
      
      const cfpbCompanies = new Set();
      bureauMatches.forEach(match => {
        const cleaned = match.replace(/<[^>]*>/g, '').trim();
        if (cleaned && cleaned.length > 2) cfpbCompanies.add(cleaned);
      });

      // Add discovered CFPB companies
      for (const name of Array.from(cfpbCompanies).slice(0, 10)) {
        if (name && typeof name === 'string') {
          discoveries.push({
            source: 'CFPB',
            name,
            company_type: 'bureau',
            confidence_score: 85,
          });
        }
      }
    } catch (err) {
      errors.push({ source: 'CFPB', error: err.message });
    }

    // 2. Fetch FDIC BankFind API
    try {
      const fdicResponse = await fetch(
        'https://banks.data.fdic.gov/api/institutions?limit=50&offset=0'
      );
      const fdicData = await fdicResponse.json();
      
      if (fdicData.data && Array.isArray(fdicData.data)) {
        fdicData.data.slice(0, 10).forEach(bank => {
          discoveries.push({
            source: 'FDIC',
            name: bank.name,
            company_type: 'bank',
            website_url: bank.website || '',
            headquarters_location: bank.city && bank.state ? `${bank.city}, ${bank.state}` : '',
            confidence_score: 90,
          });
        });
      }
    } catch (err) {
      errors.push({ source: 'FDIC', error: err.message });
    }

    // 3. Generate search queries for LLM enrichment
    const searchQueries = [
      'credit builder reports to Experian',
      'rent reporting to credit bureaus',
      'net 30 vendor credit reporting',
      'BNPL reports credit bureaus',
      'business tradeline Dun Bradstreet',
    ];

    // 4. Use LLM to discover companies from search results
    try {
      const prompt = `Find 3-5 real companies that match this search: "${searchQueries[0]}"
      Return as JSON array with: { name, company_type, confidence_score (0-100) }
      company_type values: credit_builder, rent_reporting, tradeline_provider, lender, bnpl
      Only include real, verifiable companies.`;

      const llmResult = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            companies: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  company_type: { type: 'string' },
                  confidence_score: { type: 'number' },
                },
              },
            },
          },
        },
      });

      if (llmResult.companies && Array.isArray(llmResult.companies)) {
        llmResult.companies.forEach(company => {
          discoveries.push({
            source: 'LLM_Discovery',
            ...company,
          });
        });
      }
    } catch (err) {
      errors.push({ source: 'LLM', error: err.message });
    }

    // 5. Deduplicate by name and create/update companies
    const seen = new Set();
    const created = [];
    const duplicates = [];

    for (const discovery of discoveries) {
      if (!discovery.name) continue;
      const normalizedName = discovery.name.toLowerCase().trim();
      
      if (seen.has(normalizedName)) {
        duplicates.push(discovery.name);
        continue;
      }
      seen.add(normalizedName);

      try {
        // Check if company already exists
        const existingCompanies = await base44.entities.Company.filter(
          { company_name: discovery.name },
          '-created_date',
          1
        );

        if (existingCompanies.length === 0) {
          // Create new company
          const newCompany = await base44.entities.Company.create({
            company_name: discovery.name,
            company_type: discovery.company_type || 'unknown',
            website_url: discovery.website_url || '',
            headquarters_location: discovery.headquarters_location || '',
            confidence_score: discovery.confidence_score || 50,
            status: 'pending_review',
            verification_status: 'unverified',
            source_url: discovery.source,
          });

          created.push({
            id: newCompany.id,
            name: discovery.name,
            source: discovery.source,
            confidence_score: discovery.confidence_score,
          });
        }
      } catch (err) {
        errors.push({
          company: discovery.name,
          error: err.message,
        });
      }
    }

    return Response.json({
      timestamp: new Date().toISOString(),
      summary: {
        total_discoveries: discoveries.length,
        unique_discoveries: seen.size,
        created: created.length,
        duplicates: duplicates.length,
        errors: errors.length,
      },
      created_companies: created,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});