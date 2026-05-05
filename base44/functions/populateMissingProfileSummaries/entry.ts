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

    // Find companies missing short or long description
    const companiesNeedingProfiles = companies.filter(c => !c.short_description || !c.long_description);

    // Limit to first 5 to avoid timeout
    const companiesToProcess = companiesNeedingProfiles.slice(0, 5);

    const updateResults = [];

    for (const company of companiesToProcess) {
      try {
        // Use LLM to generate profile summaries based on company type and name
        const prompt = `For the company "${company.company_name}" which is a ${company.company_type}, provide:
1. A short one-line description (max 100 chars)
2. A comprehensive long description (2-3 sentences) about what they do in the credit ecosystem

Return as JSON.`;
        
        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              short_description: { type: 'string', description: 'One-line summary under 100 chars' },
              long_description: { type: 'string', description: 'Comprehensive 2-3 sentence description' },
            },
            required: ['short_description', 'long_description'],
          },
          add_context_from_internet: true,
        });

        const updateData = {};
        if (!company.short_description && result.short_description) {
          updateData.short_description = result.short_description;
        }
        if (!company.long_description && result.long_description) {
          updateData.long_description = result.long_description;
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
            status: 'already_complete',
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
    const alreadyCompleteCount = updateResults.filter(r => r.status === 'already_complete').length;

    return Response.json({
      profile_population_timestamp: new Date().toISOString(),
      summary: {
        total_companies_needing_profiles: companiesNeedingProfiles.length,
        processed_in_batch: companiesToProcess.length,
        successfully_updated: successCount,
        failed: failureCount,
        already_complete: alreadyCompleteCount,
        remaining_to_process: companiesNeedingProfiles.length - companiesToProcess.length,
      },
      updated_companies: updateResults,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});