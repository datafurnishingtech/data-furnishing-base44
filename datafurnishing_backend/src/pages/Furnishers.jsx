import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import FurnisherTable from "@/components/furnishers/FurnisherTable";
import FurnisherDetailPanel from "@/components/furnishers/FurnisherDetailPanel";
import FurnisherFilters from "@/components/furnishers/FurnisherFilters";
import { listCompaniesPaged, getRegistrySummary, getCompanyProductCount } from "@/services/intelligenceService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 20;

export default function Furnishers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const urlSearch = searchParams.get("search") || "";

  const [selected, setSelected] = useState(null);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [typeFilter, setTypeFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [panelOpen, setPanelOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  useEffect(() => { setSearchInput(urlSearch); }, [urlSearch]);

  useEffect(() => {
    if (debouncedSearch === urlSearch) return;
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set("search", debouncedSearch); else next.delete("search");
    next.set("page", "1");
    setSearchParams(next, { replace: true });
  }, [debouncedSearch]);

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["companies-paged", page, debouncedSearch, typeFilter, verificationFilter],
    queryFn: () => listCompaniesPaged({ page, pageSize: PAGE_SIZE, search: debouncedSearch, companyType: typeFilter, verificationStatus: verificationFilter }),
    placeholderData: (prev) => prev,
  });

  const companies = pageData?.rows ?? [];
  const total = pageData?.total ?? 0;

  const { data: registrySummary } = useQuery({ queryKey: ["registry-summary"], queryFn: getRegistrySummary, staleTime: 60_000 });
  const { data: selectedProductCount = 0 } = useQuery({
    queryKey: ["company-product-count", selected?.company_id],
    queryFn: () => getCompanyProductCount(selected.company_id),
    enabled: Boolean(selected?.company_id),
  });

  useEffect(() => {
    if (!companies.length) { setSelected(null); setPanelOpen(false); return; }
    if (!selected || !companies.some((c) => c.company_id === selected.company_id)) {
      setSelected(companies[0]);
      setPanelOpen(true);
    }
  }, [companies]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelect = (company) => {
    setSelected(company);
    setPanelOpen(true);
  };

  const handleClosePanel = () => {
    setSelected(null);
    setPanelOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header + stat cards */}
      <div className="px-6 pt-6 pb-5 border-b border-border/50 bg-background">
        <PageHeader title="Furnishers" subtitle="Explore the data furnisher registry" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
          <StatCard label="Total Furnishers" value={(registrySummary?.companyCount ?? total).toLocaleString()} change={2.4} />
          <StatCard label="Verified" value={(registrySummary?.verifiedCompanyCount ?? 0).toLocaleString()} change={1.8} />
          <StatCard label="Avg. Confidence" value={`${registrySummary?.avgConfidence ?? 0}%`} />
          <StatCard label="Total Products" value={(registrySummary?.productCount ?? 0).toLocaleString()} change={5.2} />
        </div>
      </div>

      {/* Sticky filters bar */}
      <div className="sticky top-0 z-20 bg-background border-b border-border/50">
        <FurnisherFilters
          search={searchInput} onSearch={setSearchInput}
          typeFilter={typeFilter} onTypeFilter={(v) => { setTypeFilter(v); setPage(1); }}
          verificationFilter={verificationFilter} onVerificationFilter={(v) => { setVerificationFilter(v); setPage(1); }}
          onClear={() => { setSearchInput(""); setTypeFilter("all"); setVerificationFilter("all"); setSearchParams({}, { replace: true }); }}
          totalCount={total}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Table area */}
        <div className={`flex-1 min-w-0 flex flex-col ${panelOpen ? "lg:mr-0" : ""}`}>
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground text-[11px]">Loading…</div>
          ) : companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <div className="text-[13px] font-medium text-foreground/60">No furnishers found</div>
              <div className="text-[11px] text-muted-foreground/50">Try adjusting your search or filters</div>
            </div>
          ) : (
            <>
              <FurnisherTable
                companies={companies}
                selected={selected}
                onSelect={handleSelect}
              />
              {/* Pagination */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-background mt-auto">
                <span className="text-[10.5px] text-muted-foreground/60 tabular-nums hidden sm:block">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} furnishers
                </span>
                <span className="text-[10.5px] text-muted-foreground/60 tabular-nums sm:hidden">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="h-7 px-2.5 text-[10.5px] rounded font-medium border border-border/60 text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-7 min-w-[28px] px-1.5 text-[10.5px] rounded flex items-center justify-center font-medium transition-colors ${
                          p === page
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    {totalPages > 7 && (
                      <span className="text-muted-foreground/40 text-[10px] flex items-center px-1">…{totalPages}</span>
                    )}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="h-7 px-2.5 text-[10.5px] rounded font-medium border border-border/60 text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Detail panel — desktop side drawer */}
        {panelOpen && selected && (
          <div className="hidden lg:flex w-80 xl:w-88 flex-shrink-0 border-l border-border/60 flex-col" style={{ maxHeight: "calc(100vh - 160px)", position: "sticky", top: "160px" }}>
            <div className="flex-1 overflow-y-auto">
              <FurnisherDetailPanel
                company={selected}
                productCount={selectedProductCount}
                onClose={handleClosePanel}
                onOpenFullProfile={(company) => navigate(`/furnishers/${encodeURIComponent(company.slug || company.company_id)}`)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile detail panel — slide-up sheet */}
      {panelOpen && selected && (
        <div className="lg:hidden fixed inset-0 z-30 flex flex-col justify-end" onClick={handleClosePanel}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-background rounded-t-xl border-t border-border/60 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <FurnisherDetailPanel
                company={selected}
                productCount={selectedProductCount}
                onClose={handleClosePanel}
                onOpenFullProfile={(company) => { navigate(`/furnishers/${encodeURIComponent(company.slug || company.company_id)}`); handleClosePanel(); }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}