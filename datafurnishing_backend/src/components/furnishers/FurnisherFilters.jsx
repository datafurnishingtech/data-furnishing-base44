import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FurnisherTypePopover from "@/components/shared/FurnisherTypePopover";

const VERIFICATION_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "verified", label: "Verified" },
  { value: "partially_verified", label: "Partially Verified" },
  { value: "unverified", label: "Unverified" },
];

export default function FurnisherFilters({
  search, onSearch,
  typeFilter, onTypeFilter,
  verificationFilter, onVerificationFilter,
  onClear, totalCount,
}) {
  const hasActiveFilters = search || typeFilter !== "all" || verificationFilter !== "all";

  return (
    <div className="px-5 py-2.5 flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search furnishers…"
          className="pl-7 h-7 text-[11px] border-border/60 w-52 bg-background placeholder:text-muted-foreground/40 focus-visible:ring-primary/30"
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Type filter */}
      <FurnisherTypePopover value={typeFilter} onChange={onTypeFilter} />

      {/* Verification filter */}
      <Select value={verificationFilter} onValueChange={onVerificationFilter}>
        <SelectTrigger className="h-7 text-[11px] w-36 border-border/60 bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {VERIFICATION_OPTIONS.map((v) => (
            <SelectItem key={v.value} value={v.value} className="text-[11px]">{v.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear all */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 text-[11px] text-muted-foreground/60 hover:text-foreground gap-1 px-2"
        >
          <X className="w-2.5 h-2.5" /> Clear
        </Button>
      )}

      {/* Result count */}
      <div className="ml-auto text-[10.5px] text-muted-foreground/50 tabular-nums flex-shrink-0">
        {totalCount.toLocaleString()} results
      </div>
    </div>
  );
}