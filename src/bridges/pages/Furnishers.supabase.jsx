import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import FurnisherTable from "@/components/furnishers/FurnisherTable";
import FurnisherDetailPanel from "@/components/furnishers/FurnisherDetailPanel";
import FurnisherFilters from "@/components/furnishers/FurnisherFilters";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import TablePagination from "@/components/shared/TablePagination";
import { listCompaniesPaged, getRegistrySummary, getCompanyProductCount } from "@/services/intelligenceService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function Furnishers() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [typeFilter, setTypeFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: registrySummary } = useQuery({
    queryKey: ["registry-summary"],
    queryFn: getRegistrySummary,
    staleTime: 60_000,
  });

  const { data: pageData, isLoading, isFetching } = useQuery({
    queryKey: ["companies-paged", page, pageSize, debouncedSearch, typeFilter, verificationFilter],
    queryFn: () =>
      listCompaniesPaged({
        page,
        pageSize,
        search: debouncedSearch,
        companyType: typeFilter,
        verificationStatus: verificationFilter,
      }),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const companies = pageData?.rows ?? [];
  const total = pageData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const verifiedCount = registrySummary?.verifiedCompanyCount ?? 0;
  const avgConfidence = registrySummary?.avgConfidence ?? 0;
  const totalProducts = registrySummary?.productCount ?? 0;
  const totalFurnishers = registrySummary?.companyCount ?? total;

  const selectedKey = selected?.company_id || selected?.id;
  const { data: selectedProductCount = 0 } = useQuery({
    queryKey: ["company-product-count", selectedKey],
    queryFn: () => getCompanyProductCount(selectedKey),
    enabled: Boolean(selectedKey),
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, verificationFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (!companies.length) {
      setSelected(null);
      return;
    }
    const selectedId = selected?.company_id || selected?.id;
    if (!selected || !companies.some((c) => (c.company_id || c.id) === selectedId)) {
      setSelected(companies[0]);
    }
  }, [companies]);

  const handlePageChange = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function handleClear() {
    setSearch("");
    setTypeFilter("all");
    setVerificationFilter("all");
    setPage(1);
    setPageSize(20);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-w-0">
      <div className="flex-1 min-w-0">
        <PageHeader
          title="Furnisher Registry"
          subtitle="Discover, profile, and compare verified furnishers across the credit ecosystem."
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total furnishers" value={isLoading ? "—" : totalFurnishers.toLocaleString()} change={12.5} />
          <StatCard label="Verified furnishers" value={isLoading ? "—" : verifiedCount.toLocaleString()} change={10.3} />
          <StatCard label="Total products" value={isLoading ? "—" : totalProducts.toLocaleString()} change={8.7} />
          <div className="bg-card rounded-lg border border-border/60 px-4 py-3.5 flex flex-col gap-2 min-w-0">
            <span className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground/70 truncate whitespace-nowrap">
              Avg. confidence score
            </span>
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: avgConfidence }, { value: 100 - avgConfidence }]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={14}
                      outerRadius={18}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <Cell fill="#4F46E5" />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-semibold text-foreground">{avgConfidence}%</span>
                </div>
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground leading-none tracking-tight">{avgConfidence}</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">↑ avg. confidence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <FurnisherFilters
          search={search}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          typeFilter={typeFilter}
          onTypeFilter={(v) => { setTypeFilter(v); setPage(1); }}
          verificationFilter={verificationFilter}
          onVerificationFilter={(v) => { setVerificationFilter(v); setPage(1); }}
          onClear={handleClear}
          totalCount={total}
        />

        {/* Table */}
        {isLoading && !pageData ? (
          <div className="bg-card rounded-lg border border-border/60 p-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-card rounded-lg border border-border/60 p-12 text-center">
            <p className="text-[12px] text-muted-foreground">No furnishers match your filters.</p>
          </div>
        ) : (
          <div className={isFetching ? "opacity-60 transition-opacity duration-150" : "transition-opacity duration-150"}>
            <FurnisherTable
              companies={companies}
              selected={selected}
              onSelect={setSelected}
            />
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            />
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <FurnisherDetailPanel
        company={selected}
        productCount={selectedProductCount}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}