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

    const companyIds = new Set(companies.map(c => c.id));
    const orphanedProducts = products.filter(p => !companyIds.has(p.company_id));

    // Delete orphaned products
    const deleteResults = [];
    for (const product of orphanedProducts) {
      try {
        await base44.entities.Product.delete(product.id);
        deleteResults.push({
          id: product.id,
          name: product.product_name,
          company_id: product.company_id,
          status: 'deleted',
        });
      } catch (error) {
        deleteResults.push({
          id: product.id,
          name: product.product_name,
          company_id: product.company_id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    const successCount = deleteResults.filter(r => r.status === 'deleted').length;
    const failureCount = deleteResults.filter(r => r.status === 'failed').length;

    return Response.json({
      cleanup_timestamp: new Date().toISOString(),
      summary: {
        total_orphaned_found: orphanedProducts.length,
        successfully_deleted: successCount,
        failed: failureCount,
      },
      deleted_products: deleteResults,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});