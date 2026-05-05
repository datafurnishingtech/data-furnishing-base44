import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Seed data derived from the "Obvious Tradeline Furnishers & Credit Reporting Ecosystem" document
const SEED_COMPANIES = [
  // 1. Consumer credit-builder / tradeline apps
  { company_name: "Self", company_type: "credit_builder", short_description: "Credit-builder loan and secured card", website_url: "https://www.self.inc" },
  { company_name: "Kikoff", company_type: "credit_builder", short_description: "Revolving line, rent reporting, and credit-building products", website_url: "https://kikoff.com" },
  { company_name: "CreditStrong", company_type: "credit_builder", short_description: "Credit-builder installment accounts", website_url: "https://www.creditstrong.com" },
  { company_name: "Ava", company_type: "credit_builder", short_description: "Credit-builder card and subscription-based credit product", website_url: "https://www.avacredit.com" },
  { company_name: "Grow Credit", company_type: "credit_builder", short_description: "Subscription tradeline and bill reporting", website_url: "https://growcredit.com" },
  { company_name: "Experian Boost", company_type: "specialty_reporting_company", short_description: "Utility, phone, streaming, rent/payment data added to Experian", website_url: "https://www.experian.com/consumer-products/score-boost.html" },
  { company_name: "Chime Credit Builder", company_type: "credit_builder", short_description: "Secured credit card-style builder", website_url: "https://www.chime.com" },
  { company_name: "Extra", company_type: "credit_builder", short_description: "Debit card with credit reporting model", website_url: "https://extra.app" },
  { company_name: "Cred.ai", company_type: "credit_builder", short_description: "Credit optimization and card-style reporting", website_url: "https://www.cred.ai" },
  { company_name: "MoneyLion", company_type: "credit_builder", short_description: "Credit builder loans and financial app", website_url: "https://www.moneylion.com" },
  { company_name: "Brigit", company_type: "credit_builder", short_description: "Credit builder product", website_url: "https://www.hellobrigit.com" },
  { company_name: "TomoCredit", company_type: "credit_builder", short_description: "Charge card and credit reporting model", website_url: "https://www.tomocredit.com" },
  { company_name: "Grain", company_type: "credit_builder", short_description: "Credit line tied to cash flow", website_url: "https://grain.money" },
  { company_name: "SeedFi", company_type: "credit_builder", short_description: "Credit-builder loan model, historically tied into Intuit/Credit Karma ecosystem", website_url: "https://www.seedfi.com" },
  { company_name: "Sable", company_type: "credit_builder", short_description: "Credit-builder card model", website_url: "https://www.sablecard.com" },
  { company_name: "Dovly", company_type: "credit_builder", short_description: "Credit repair and builder product", website_url: "https://dovly.com" },
  { company_name: "Credit Sesame", company_type: "credit_builder", short_description: "Credit monitoring and credit builder/card products", website_url: "https://www.creditsesame.com" },
  { company_name: "Firstcard", company_type: "credit_builder", short_description: "Student/consumer credit builder card", website_url: "https://www.firstcard.com" },

  // 2. Rent-reporting companies
  { company_name: "Boom", company_type: "rent_reporting", short_description: "Rent reporting to credit bureaus", website_url: "https://www.boom.money" },
  { company_name: "RentReporters", company_type: "rent_reporting", short_description: "Rent reporting to bureaus", website_url: "https://www.rentreporters.com" },
  { company_name: "Rental Kharma", company_type: "rent_reporting", short_description: "Past and current rent reporting", website_url: "https://rentalkharma.com" },
  { company_name: "LevelCredit", company_type: "rent_reporting", short_description: "Rent and utility reporting", website_url: "https://levelcredit.com" },
  { company_name: "Esusu", company_type: "rent_reporting", short_description: "Rent reporting, often through landlords/property managers", website_url: "https://www.esusurent.com" },
  { company_name: "Piñata", company_type: "rent_reporting", short_description: "Rent rewards and rent reporting", website_url: "https://www.pinata.rent" },
  { company_name: "Bilt", company_type: "rent_reporting", short_description: "Rent payments and card ecosystem", website_url: "https://www.biltrewards.com" },
  { company_name: "FrontLobby", company_type: "rent_reporting", short_description: "Rent reporting and landlord-tenant reporting", website_url: "https://frontlobby.com" },
  { company_name: "RentTrack", company_type: "rent_reporting", short_description: "Rent reporting", website_url: "https://www.renttrack.com" },
  { company_name: "Avail CreditBoost", company_type: "rent_reporting", short_description: "Rent reporting through landlord/property management flow", website_url: "https://www.avail.co" },
  { company_name: "Jetty Credit", company_type: "rent_reporting", short_description: "Rent reporting", website_url: "https://www.jetty.com" },
  { company_name: "StellarFi", company_type: "rent_reporting", short_description: "Bill payment reporting", website_url: "https://stellarfi.com" },
  { company_name: "Cushion", company_type: "credit_builder", short_description: "Bill payment and credit-building product", website_url: "https://cushionapp.com" },

  // 3. Business tradeline / vendor-credit companies
  { company_name: "Uline", company_type: "business_credit_vendor", short_description: "Net 30 business vendor tradeline", website_url: "https://www.uline.com" },
  { company_name: "Grainger", company_type: "business_credit_vendor", short_description: "Business vendor account", website_url: "https://www.grainger.com" },
  { company_name: "Quill", company_type: "business_credit_vendor", short_description: "Office supply/vendor credit", website_url: "https://www.quill.com" },
  { company_name: "Nav", company_type: "business_credit_vendor", short_description: "Business credit monitoring and tradeline/payment products", website_url: "https://www.nav.com" },
  { company_name: "eCredable", company_type: "specialty_reporting_company", short_description: "Business bill reporting and utility reporting", website_url: "https://ecredable.com" },
  { company_name: "Amazon Business", company_type: "business_credit_vendor", short_description: "Pay by Invoice / business account", website_url: "https://business.amazon.com" },
  { company_name: "Office Depot Business Solutions", company_type: "business_credit_vendor", short_description: "Commercial account", website_url: "https://www.officedepot.com/business" },
  { company_name: "Staples Business Advantage", company_type: "business_credit_vendor", short_description: "Commercial account", website_url: "https://www.staples.com/sbd/cre/programs/advantage" },
  { company_name: "WEX", company_type: "business_credit_vendor", short_description: "Fleet card and payment tradeline", website_url: "https://www.wexinc.com" },
  { company_name: "Shell Fleet", company_type: "business_credit_vendor", short_description: "Fleet card", website_url: "https://www.shell.us/business-customers/shell-fleet-solutions.html" },

  // 4. Business/commercial lenders and credit card issuers
  { company_name: "Brex", company_type: "commercial_lender", short_description: "Corporate card for businesses", website_url: "https://www.brex.com" },
  { company_name: "Ramp", company_type: "commercial_lender", short_description: "Corporate card", website_url: "https://ramp.com" },
  { company_name: "BILL Divvy", company_type: "commercial_lender", short_description: "Corporate card", website_url: "https://www.bill.com/divvy" },
  { company_name: "Stripe Capital", company_type: "commercial_lender", short_description: "Merchant cash/working capital", website_url: "https://stripe.com/capital" },
  { company_name: "Square Loans", company_type: "commercial_lender", short_description: "Merchant working capital", website_url: "https://squareup.com/us/en/capital" },
  { company_name: "PayPal Working Capital", company_type: "commercial_lender", short_description: "Merchant working capital", website_url: "https://www.paypal.com/us/webapps/mpp/working-capital" },
  { company_name: "Shopify Capital", company_type: "commercial_lender", short_description: "Merchant working capital", website_url: "https://www.shopify.com/capital" },
  { company_name: "OnDeck", company_type: "commercial_lender", short_description: "Small-business lending", website_url: "https://www.ondeck.com" },
  { company_name: "Bluevine", company_type: "commercial_lender", short_description: "Business line of credit and banking", website_url: "https://www.bluevine.com" },
  { company_name: "Fundbox", company_type: "commercial_lender", short_description: "Business line of credit", website_url: "https://fundbox.com" },
  { company_name: "Kabbage", company_type: "commercial_lender", short_description: "Small-business funding via AmEx Business Blueprint", website_url: "https://www.kabbage.com" },
  { company_name: "Lendio", company_type: "commercial_lender", short_description: "Business loan marketplace", website_url: "https://www.lendio.com" },

  // 5. Consumer banks, cards, personal lenders
  { company_name: "Synchrony", company_type: "direct_furnisher", short_description: "Retail credit cards", website_url: "https://www.synchrony.com" },
  { company_name: "Comenity / Bread Financial", company_type: "direct_furnisher", short_description: "Retail credit cards", website_url: "https://www.breadfinancial.com" },
  { company_name: "Goldman Sachs / Apple Card", company_type: "direct_furnisher", short_description: "Consumer credit card", website_url: "https://www.goldmansachs.com" },
  { company_name: "SoFi", company_type: "direct_furnisher", short_description: "Personal loans and credit card", website_url: "https://www.sofi.com" },
  { company_name: "LendingClub", company_type: "direct_furnisher", short_description: "Personal loans", website_url: "https://www.lendingclub.com" },
  { company_name: "Upgrade", company_type: "direct_furnisher", short_description: "Personal loans and card", website_url: "https://www.upgrade.com" },
  { company_name: "Upstart", company_type: "direct_furnisher", short_description: "Personal loans", website_url: "https://www.upstart.com" },
  { company_name: "Best Egg", company_type: "direct_furnisher", short_description: "Personal loans", website_url: "https://www.bestegg.com" },
  { company_name: "OneMain Financial", company_type: "direct_furnisher", short_description: "Personal loans", website_url: "https://www.onemainfinancial.com" },
  { company_name: "OppFi", company_type: "direct_furnisher", short_description: "Installment lending", website_url: "https://www.oppfi.com" },
  { company_name: "Oportun", company_type: "direct_furnisher", short_description: "Personal loans and credit card", website_url: "https://oportun.com" },
  { company_name: "Mission Lane", company_type: "direct_furnisher", short_description: "Credit card", website_url: "https://www.missionlane.com" },
  { company_name: "Petal", company_type: "direct_furnisher", short_description: "Credit card", website_url: "https://www.petalcard.com" },
  { company_name: "OpenSky", company_type: "direct_furnisher", short_description: "Secured credit card", website_url: "https://www.openskycc.com" },
  { company_name: "Credit One Bank", company_type: "direct_furnisher", short_description: "Credit card", website_url: "https://www.creditonebank.com" },
  { company_name: "PREMIER Bankcard", company_type: "direct_furnisher", short_description: "Credit card", website_url: "https://www.firstpremier.com" },

  // 6. Auto lenders / lease furnishers
  { company_name: "Toyota Financial Services", company_type: "auto_lender", short_description: "Auto loan and lease financing", website_url: "https://www.toyotafinancial.com" },
  { company_name: "Ford Credit", company_type: "auto_lender", short_description: "Auto loan and lease financing", website_url: "https://www.fordcredit.com" },
  { company_name: "GM Financial", company_type: "auto_lender", short_description: "Auto loan and lease financing", website_url: "https://www.gmfinancial.com" },
  { company_name: "Honda Financial Services", company_type: "auto_lender", short_description: "Auto loan and lease financing", website_url: "https://www.hondafinancialservices.com" },
  { company_name: "Hyundai Motor Finance", company_type: "auto_lender", short_description: "Auto loan and lease financing", website_url: "https://www.hmfusa.com" },
  { company_name: "BMW Financial Services", company_type: "auto_lender", short_description: "Auto loan and lease financing", website_url: "https://www.bmwusa.com/financial-services" },
  { company_name: "Mercedes-Benz Financial Services", company_type: "auto_lender", short_description: "Auto loan and lease financing", website_url: "https://www.mbusa.com/en/financial-services" },
  { company_name: "Tesla Finance", company_type: "auto_lender", short_description: "Auto financing", website_url: "https://www.tesla.com/support/financing" },
  { company_name: "CarMax Auto Finance", company_type: "auto_lender", short_description: "Auto loan", website_url: "https://www.carmax.com/car-financing" },
  { company_name: "Carvana / Bridgecrest", company_type: "auto_lender", short_description: "Auto loan financing", website_url: "https://www.bridgecrest.com" },
  { company_name: "Santander Consumer USA", company_type: "auto_lender", short_description: "Auto loan", website_url: "https://www.santanderconsumerusa.com" },
  { company_name: "Westlake Financial", company_type: "auto_lender", short_description: "Auto loan", website_url: "https://www.westlakefinancial.com" },
  { company_name: "Credit Acceptance", company_type: "auto_lender", short_description: "Auto loan", website_url: "https://www.creditacceptance.com" },
  { company_name: "Ally Financial", company_type: "auto_lender", short_description: "Auto loan and lease", website_url: "https://www.ally.com" },
  { company_name: "Exeter Finance", company_type: "auto_lender", short_description: "Auto loan", website_url: "https://www.exeterfinance.com" },

  // 7. BNPL / point-of-sale finance
  { company_name: "Affirm", company_type: "bnpl_pos_finance", short_description: "Installment/BNPL reporting in some contexts", website_url: "https://www.affirm.com" },
  { company_name: "Klarna", company_type: "bnpl_pos_finance", short_description: "BNPL/payment reporting varies by product", website_url: "https://www.klarna.com" },
  { company_name: "Afterpay", company_type: "bnpl_pos_finance", short_description: "BNPL/payment data", website_url: "https://www.afterpay.com" },
  { company_name: "Sezzle", company_type: "bnpl_pos_finance", short_description: "Credit builder/BNPL reporting products", website_url: "https://sezzle.com" },
  { company_name: "Zip", company_type: "bnpl_pos_finance", short_description: "BNPL", website_url: "https://zip.co" },
  { company_name: "Acima", company_type: "bnpl_pos_finance", short_description: "Lease-to-own/financing", website_url: "https://www.acima.com" },
  { company_name: "Snap Finance", company_type: "bnpl_pos_finance", short_description: "Lease-to-own/financing", website_url: "https://snapfinance.com" },
  { company_name: "Progressive Leasing", company_type: "bnpl_pos_finance", short_description: "Lease-to-own/financing", website_url: "https://www.progleasing.com" },
  { company_name: "Sunbit", company_type: "bnpl_pos_finance", short_description: "POS financing", website_url: "https://sunbit.com" },
  { company_name: "Splitit", company_type: "bnpl_pos_finance", short_description: "Installment payments", website_url: "https://www.splitit.com" },

  // 8. Telecom, utility, subscription
  { company_name: "Verizon", company_type: "direct_furnisher", short_description: "Telecom/account data furnisher", website_url: "https://www.verizon.com" },
  { company_name: "AT&T", company_type: "direct_furnisher", short_description: "Telecom/account data furnisher", website_url: "https://www.att.com" },
  { company_name: "T-Mobile", company_type: "direct_furnisher", short_description: "Telecom/account data furnisher", website_url: "https://www.t-mobile.com" },
  { company_name: "Xfinity / Comcast", company_type: "direct_furnisher", short_description: "Telecom/account data furnisher", website_url: "https://www.xfinity.com" },
  { company_name: "Perch Credit", company_type: "credit_builder", short_description: "Historical credit-building app", website_url: "https://www.perchcredit.com" },

  // 9. Specialty reporting companies and infrastructure
  { company_name: "LexisNexis Risk Solutions", company_type: "specialty_reporting_company", short_description: "Specialty data/reporting", website_url: "https://risk.lexisnexis.com" },
  { company_name: "ChexSystems", company_type: "specialty_reporting_company", short_description: "Bank account reporting", website_url: "https://www.chexsystems.com" },
  { company_name: "Early Warning Services", company_type: "specialty_reporting_company", short_description: "Banking risk data", website_url: "https://www.earlywarning.com" },
  { company_name: "CoreLogic", company_type: "specialty_reporting_company", short_description: "Property/rental/mortgage data", website_url: "https://www.corelogic.com" },
  { company_name: "Innovis", company_type: "bureau", short_description: "Consumer reporting agency", website_url: "https://www.innovis.com" },
  { company_name: "Clarity Services", company_type: "specialty_reporting_company", short_description: "Alternative credit data", website_url: "https://www.clarityservices.com" },
  { company_name: "FactorTrust", company_type: "specialty_reporting_company", short_description: "Alternative/subprime credit data", website_url: "https://www.factortrust.com" },
  { company_name: "MicroBilt", company_type: "specialty_reporting_company", short_description: "Alternative credit data", website_url: "https://www.microbilt.com" },
  { company_name: "Teletrack", company_type: "specialty_reporting_company", short_description: "Alternative consumer reporting", website_url: "https://teletrack.com" },
  { company_name: "Plaid", company_type: "data_infrastructure", short_description: "Bank data infrastructure", website_url: "https://plaid.com" },
  { company_name: "Finicity", company_type: "data_infrastructure", short_description: "Bank data infrastructure", website_url: "https://www.finicity.com" },
  { company_name: "MX Technologies", company_type: "data_infrastructure", short_description: "Bank data infrastructure", website_url: "https://www.mx.com" },
  { company_name: "Argyle", company_type: "data_infrastructure", short_description: "Payroll/income data", website_url: "https://argyle.com" },
  { company_name: "Atomic", company_type: "data_infrastructure", short_description: "Payroll/income data", website_url: "https://www.atomicfi.com" },
  { company_name: "Method Financial", company_type: "data_infrastructure", short_description: "Liability/payment infrastructure", website_url: "https://methodfi.com" },
  { company_name: "Array", company_type: "data_infrastructure", short_description: "Credit data/components infrastructure", website_url: "https://array.com" },
  { company_name: "Bloom Credit", company_type: "data_infrastructure", short_description: "Credit data API/infrastructure", website_url: "https://bloomcredit.io" },
  { company_name: "Nova Credit", company_type: "data_infrastructure", short_description: "Alternative/global credit data", website_url: "https://www.novacredit.com" },

  // 10. Business credit data / vendor ecosystem
  { company_name: "Creditsafe", company_type: "data_infrastructure", short_description: "Business credit data", website_url: "https://www.creditsafe.com" },
  { company_name: "Ansonia Credit Data", company_type: "specialty_reporting_company", short_description: "Business credit data", website_url: "https://www.ansoniacreditdata.com" },
  { company_name: "PayNet", company_type: "specialty_reporting_company", short_description: "Commercial credit data", website_url: "https://www.paynetonline.com" },
  { company_name: "NACM", company_type: "specialty_reporting_company", short_description: "Trade credit data/network", website_url: "https://www.nacm.org" },
  { company_name: "TreviPay", company_type: "business_credit_vendor", short_description: "B2B payments/trade credit", website_url: "https://www.trevipay.com" },
  { company_name: "Resolve Pay", company_type: "business_credit_vendor", short_description: "B2B net terms", website_url: "https://resolvepay.com" },
  { company_name: "Credit Key", company_type: "business_credit_vendor", short_description: "B2B financing", website_url: "https://www.creditkey.com" },
  { company_name: "Allianz Trade", company_type: "specialty_reporting_company", short_description: "Trade credit insurance/data", website_url: "https://www.allianz-trade.com" },
];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = body.dry_run === true;
  const batchSize = body.batch_size || SEED_COMPANIES.length;
  const offset = body.offset || 0;

  const batch = SEED_COMPANIES.slice(offset, offset + batchSize);

  if (dryRun) {
    return Response.json({
      dry_run: true,
      total_in_seed: SEED_COMPANIES.length,
      batch_start: offset,
      batch_size: batch.length,
      companies: batch.map(c => ({ company_name: c.company_name, company_type: c.company_type })),
    });
  }

  const results = { created: [], skipped: [], errors: [] };

  for (const company of batch) {
    // Check for existing company to avoid duplicates
    const existing = await base44.asServiceRole.entities.Company.filter({ company_name: company.company_name });
    if (existing && existing.length > 0) {
      results.skipped.push(company.company_name);
      continue;
    }

    const saved = await base44.asServiceRole.entities.Company.create({
      ...company,
      status: 'pending_review',
      verification_status: 'unverified',
      confidence_score: 30, // low baseline — needs research enrichment
      source_notes: 'Seeded from Obvious Tradeline Furnishers seed map v1',
    });
    results.created.push({ id: saved.id, name: saved.company_name });
  }

  return Response.json({
    success: true,
    total_in_seed: SEED_COMPANIES.length,
    batch_start: offset,
    created: results.created.length,
    skipped: results.skipped.length,
    errors: results.errors.length,
    created_companies: results.created,
    skipped_companies: results.skipped,
  });
});