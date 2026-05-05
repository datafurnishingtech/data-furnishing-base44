import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all companies
    const companies = await base44.asServiceRole.entities.Company.list('-created_date', 500);

    const placeholderPatterns = [
      /^City,\s*State$/i,
      /^city,\s*state$/i,
      /^N\/A$/i,
      /^Unknown$/i,
      /^TBD$/i,
    ];

    const fixed = [];
    const errors = [];

    for (const company of companies) {
      if (!company.headquarters_location) continue;

      const hasPlaceholder = placeholderPatterns.some(pattern =>
        pattern.test(company.headquarters_location.trim())
      );

      if (hasPlaceholder) {
        try {
          // Use LLM to find real HQ location
          const prompt = `Find the headquarters location (city, state/country) for this company: ${company.company_name}. Return only "City, State" or "City, Country" format. Be accurate and concise.`;

          const result = await base44.integrations.Core.InvokeLLM({
            prompt,
            add_context_from_internet: true,
            response_json_schema: {
              type: 'object',
              properties: {
                headquarters_location: { type: 'string' },
              },
            },
          });

          if (result.headquarters_location && !placeholderPatterns.some(p => p.test(result.headquarters_location))) {
            await base44.asServiceRole.entities.Company.update(company.id, {
              headquarters_location: result.headquarters_location,
            });

            fixed.push({
              id: company.id,
              name: company.company_name,
              old_value: company.headquarters_location,
              new_value: result.headquarters_location,
            });
          }
        } catch (err) {
          errors.push({
            id: company.id,
            name: company.company_name,
            error: err.message,
          });
        }
      }
    }

    return Response.json({
      timestamp: new Date().toISOString(),
      summary: {
        total_companies: companies.length,
        companies_with_placeholders: companies.filter(c =>
          c.headquarters_location &&
          placeholderPatterns.some(p => p.test(c.headquarters_location.trim()))
        ).length,
        fixed: fixed.length,
        errors: errors.length,
      },
      fixed_companies: fixed,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});