import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/shared/StatCard";
import PageHeader from "@/components/shared/PageHeader";
import FurnisherTable from "@/components/furnishers/FurnisherTable";
import FurnisherDetailPanel from "@/components/furnishers/FurnisherDetailPanel";
import FurnisherFilters from "@/components/furnishers/FurnisherFilters";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import TablePagination from "@/components/shared/TablePagination";

export default function Furnishers() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => base44.entities.Company.list("-created_date", 500),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products-count"],
    queryFn: () => base44.entities.Product.list("-created_date", 500),
  });

  // Select first company once loaded
  useEffect(() => {
    if (companies.length > 0 && !selected) {
      setSelected(companies[0]);
    }
  }, [companies]);

  const filtered = useMemo(() => {
    return companies
      .filter((c) => {
        const matchSearch =
          !search ||
          c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
          c.short_description?.toLowerCase().includes(search.toLowerCase()) ||
          c.legal_name?.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || c.company_type === typeFilter;
        const matchVerification = verificationFilter === "all" || c.verification_status === verificationFilter;
        return matchSearch && matchType && matchVerification;
      })
      .sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0));
  }, [companies, search, typeFilter, verificationFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const verifiedCount = companies.filter((c) => c.verification_status === "verified").length;
  const avgConfidence = companies.length
    ? Math.round(companies.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / companies.length)
    : 0;

  const selectedProductCount = selected
    ? products.filter((p) => p.company_id === selected.id).length
    : 0;

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
          <StatCard label="Total furnishers" value={isLoading ? "—" : companies.length.toLocaleString()} change={12.5} />
          <StatCard label="Verified furnishers" value={isLoading ? "—" : verifiedCount.toLocaleString()} change={10.3} />
          <StatCard label="Total products" value={isLoading ? "—" : products.length.toLocaleString()} change={8.7} />
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
          totalCount={filtered.length}
        />

        {/* Table */}
        {isLoading ? (
          <div className="bg-card rounded-lg border border-border/60 p-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-card rounded-lg border border-border/60 p-12 text-center">
            <p className="text-[12px] text-muted-foreground">No furnishers match your filters.</p>
          </div>
        ) : (
          <>
            <FurnisherTable
              companies={paginated}
              selected={selected}
              onSelect={setSelected}
            />
            {/* Pagination */}
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            />
          </>
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