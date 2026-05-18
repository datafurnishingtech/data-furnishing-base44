import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import ProductEnrichedDetail from "@/components/furnishers/ProductEnrichedDetail";
import CompanyDetailSections from "@/bridges/components/furnishers/CompanyDetailSections.supabase";
import { getCompanyBySlug, listProductsPaged, listProductBureauReporting, getCompanyProductCount } from "@/services/intelligenceService";
import { Button } from "@/components/ui/button";

const COMPANY_TYPE_LABELS = {
  direct_furnisher: "Direct Furnisher", tradeline_provider: "Tradeline Provider",
  reporting_intermediary: "Intermediary", credit_builder: "Credit Builder",
  credit_union: "Credit Union", bank: "Bank", rent_reporting: "Rent Reporting",
  business_credit_vendor: "Business Vendor", commercial_lender: "Commercial Lender",
  mortgage_lender: "Mortgage Lender", student_loan_servicer: "Student Loan Servicer",
  fintech_lender: "Fintech Lender", auto_lender: "Auto Lender",
  bnpl_pos_finance: "BNPL / POS Finance", specialty_reporting_company: "Specialty Reporting",
  data_infrastructure: "Data Infrastructure", bureau: "Bureau", unknown: "Unknown",
};

export default function FurnisherProfilePage() {
  const { slug } = useParams();

  const { data: company, isLoading: companyLoading, error: companyError } = useQuery({
    queryKey: ["company-profile", slug],
    queryFn: () => getCompanyBySlug(decodeURIComponent(slug)),
    enabled: Boolean(slug),
  });

  const { data: productTotal = 0 } = useQuery({
    queryKey: ["company-product-count", company?.company_id],
    queryFn: () => getCompanyProductCount(company.company_id),
    enabled: Boolean(company?.company_id),
  });

  const { data: productPages, isLoading: productsLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["company-products-paged", company?.company_id],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => listProductsPaged({ companyId: company.company_id, page: pageParam, pageSize: 20, search: "", productType: "all", bureau: "all", target: "all" }),
    getNextPageParam: (last) => { const loaded = Math.min(last.page * last.pageSize, last.total); return loaded < last.total ? last.page + 1 : undefined; },
    enabled: Boolean(company?.company_id),
  });

  const products = useMemo(() => productPages?.pages.flatMap((p) => p.rows) ?? [], [productPages]);
  const productIds = useMemo(() => products.map((p) => p.product_id).filter(Boolean), [products]);

  const { data: bureauRows = [] } = useQuery({
    queryKey: ["company-bureau-reporting", company?.company_id, productIds.length],
    queryFn: () => listProductBureauReporting(productIds),
    enabled: productIds.length > 0,
  });

  const bureauByProduct = useMemo(() => {
    const m = {};
    for (const row of bureauRows) { const id = row.product_id; if (!id) continue; m[id] = [...(m[id] || []), row]; }
    return m;
  }, [bureauRows]);

  const domain = company?.domain || company?.website_url?.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "") || "";

  if (!slug) return null;
  if (companyLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground text-[11px]">Loading…</div>;
  if (companyError || !company) {
    return (
      <div className="p-6">
        <Link to="/furnishers" className="flex items-center gap-1 text-[11px] text-primary mb-4"><ArrowLeft className="w-3.5 h-3.5" /> Back to furnishers</Link>
        <p className="text-muted-foreground text-[12px]">Furnisher not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden min-w-0">
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="px-4 lg:px-6 pt-4 pb-2 border-b border-border">
          <Link to="/furnishers" className="flex items-center gap-1 text-[11px] text-primary mb-3"><ArrowLeft className="w-3.5 h-3.5" /> Back to furnishers</Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
            <FurnisherLogo domain={domain} name={company.company_name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{company.company_name}</h1>
                {company.verification_status === "verified" && <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Verified</span>}
              </div>
              {company.legal_name && company.legal_name !== company.company_name && <p className="text-[11px] text-muted-foreground">{company.legal_name}</p>}
              <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground/60">
                {domain && <a href={company.website_url || `https://${domain}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">{domain} <ExternalLink className="w-2.5 h-2.5" /></a>}
                <span>{COMPANY_TYPE_LABELS[company.company_type] || company.company_type}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 lg:p-6 pb-4">
          <div className="bg-card rounded-lg border border-border p-3"><div className="text-[10px] text-muted-foreground/60 mb-1">Data confidence</div><div className="text-lg font-semibold">{company.confidence_score != null ? `${company.confidence_score}/100` : "—"}</div></div>
          <div className="bg-card rounded-lg border border-border p-3"><div className="text-[10px] text-muted-foreground/60 mb-1">Products</div><div className="text-lg font-semibold">{productsLoading ? "…" : `${products.length} / ${Number(productTotal).toLocaleString()}`}</div></div>
          <div className="bg-card rounded-lg border border-border p-3"><div className="text-[10px] text-muted-foreground/60 mb-1">Last verified</div><div className="text-[12px] font-medium">{company.last_verified_at || "—"}</div></div>
          <div className="bg-card rounded-lg border border-border p-3"><div className="text-[10px] text-muted-foreground/60 mb-1">Completeness</div><div className="text-[12px] font-medium">{company.data_completeness_score ?? "—"}</div></div>
        </div>

        <div className="px-4 lg:px-6 pb-6 space-y-4">
          <div className="bg-card rounded-lg border border-border p-4 text-[11px]">
            <h2 className="text-[12px] font-semibold mb-3">Overview</h2>
            {company.long_description || company.short_description ? (
              <p className="text-muted-foreground mb-3 leading-relaxed">{company.long_description || company.short_description}</p>
            ) : null}
            <CompanyDetailSections company={company} />
          </div>

          <div>
            <h2 className="text-[12px] font-semibold mb-3">Products & Enriched Data</h2>
            {productsLoading ? (
              <div className="text-[11px] text-muted-foreground/60">Loading products…</div>
            ) : products.length === 0 ? (
              <div className="text-[11px] text-muted-foreground/60">No products linked to this furnisher yet.</div>
            ) : (
              <>
                {products.map((product) => <ProductEnrichedDetail key={product.product_id} product={product} bureauCoverage={bureauByProduct[product.product_id] || []} />)}
                {(hasNextPage || isFetchingNextPage) && (
                  <Button variant="outline" size="sm" className="w-full h-8 text-[11px]" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? "Loading…" : hasNextPage ? "Load more products" : "All loaded"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
