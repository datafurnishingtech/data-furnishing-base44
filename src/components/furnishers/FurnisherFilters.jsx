import React from "react";
import { Search } from "lucide-react";
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

export default function FurnisherFilters({ search, onSearch, typeFilter, onTypeFilter, verificationFilter, onVerificationFilter, onClear, totalCount }) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <FurnisherTypePopover value={typeFilter} onChange={onTypeFilter} />

        <Select value={verificationFilter} onValueChange={onVerificationFilter}>
          <SelectTrigger className="w-auto min-w-[140px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            {VERIFICATION_OPTIONS.map((v) => (
              <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          onClick={onClear}
          className="text-[11px] text-primary/70 hover:text-primary font-normal ml-auto"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
          <Input
            placeholder="Search furnishers by name, description..."
            className="pl-8 h-7 text-[11px] border-border/60"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{totalCount} results</span>
        <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5 font-normal text-muted-foreground border-border/60">
          Export
        </Button>
      </div>
    </div>
  );
}