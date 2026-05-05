import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all companies
    const companies = await base44.entities.Company.list('-created_date', 500);

    // Find companies missing website_url or headquarters_location
    const companiesNeedingData = companies.filter(c => !c.website_url || !c.headquarters_location);

    const updateResults = [];

    for (const company of companiesNeedingData) {
      const fieldsToFetch = [];
      if (!company.website_url) fieldsToFetch.push('website_url');
      if (!company.headquarters_location) fieldsToFetch.push('headquarters_location');

      try {
        // Use LLM to look up missing data
        const prompt = `For the company "${company.company_name}", provide their official ${fieldsToFetch.join(' and ')} in JSON format.`;
        
        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              website_url: { type: 'string', description: 'Official company website URL' },
              headquarters_location: { type: 'string', description: 'City, State format (e.g., New York, NY)' },
            },
          },
          add_context_from_internet: true,
        });

        const updateData = {};
        if (!company.website_url && result.website_url) {
          updateData.website_url = result.website_url;
        }
        if (!company.headquarters_location && result.headquarters_location) {
          updateData.headquarters_location = result.headquarters_location;
        }

        if (Object.keys(updateData).length > 0) {
          await base44.entities.Company.update(company.id, updateData);
          updateResults.push({
            id: company.id,
            name: company.company_name,
            updated_fields: Object.keys(updateData),
            data: updateData,
            status: 'success',
          });
        } else {
          updateResults.push({
            id: company.id,
            name: company.company_name,
            status: 'no_data_found',
          });
        }
      } catch (error) {
        updateResults.push({
          id: company.id,
          name: company.company_name,
          status: 'failed',
          error: error.message,
        });
      }
    }

    const successCount = updateResults.filter(r => r.status === 'success').length;
    const failureCount = updateResults.filter(r => r.status === 'failed').length;

    return Response.json({
      population_timestamp: new Date().toISOString(),
      summary: {
        total_companies_needing_data: companiesNeedingData.length,
        successfully_updated: successCount,
        failed: failureCount,
        no_data_found: updateResults.filter(r => r.status === 'no_data_found').length,
      },
      updated_companies: updateResults,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});