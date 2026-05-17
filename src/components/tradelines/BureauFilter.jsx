import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GROUP_LABELS = {
  consumer: "Consumer",
  business: "Business / Commercial",
  commercial: "Business / Commercial",
  specialty: "Specialty / Secondary",
  data_exchange: "Data Exchange",
};

const GROUP_ORDER = ["consumer", "business", "commercial", "specialty", "data_exchange"];

const normalizeBureau = (bureau) => ({
  id: bureau.id,
  name: bureau.bureau_name || bureau.name || "Unnamed Bureau",
  abbr: bureau.abbr,
  type: bureau.bureau_type || "specialty",
});

export default function BureauFilter({ value, onChange, bureaus = [] }) {
  const activeBureaus = bureaus
    .map(normalizeBureau)
    .filter((bureau) => bureau.name)
    .sort((a, b) => {
      const typeDiff = GROUP_ORDER.indexOf(a.type) - GROUP_ORDER.indexOf(b.type);
      return typeDiff !== 0 ? typeDiff : a.name.localeCompare(b.name);
    });

  const grouped = activeBureaus.reduce((groups, bureau) => {
    const groupKey = GROUP_ORDER.includes(bureau.type) ? bureau.type : "specialty";
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(bureau);
    return groups;
  }, {});

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto min-w-[150px] h-7 text-[11px] border-border/60 text-muted-foreground font-normal">
        <SelectValue placeholder="Bureau" />
      </SelectTrigger>
      <SelectContent className="max-h-80 min-w-[220px]">
        <SelectItem value="all">All Bureaus</SelectItem>
        {GROUP_ORDER.map((groupKey) => grouped[groupKey]?.length ? (
          <div key={groupKey}>
            <div className="px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60">
              {GROUP_LABELS[groupKey]}
            </div>
            {grouped[groupKey].map((bureau) => (
              <SelectItem key={bureau.id} value={bureau.id}>
                <span className="flex items-center gap-2">
                  <span>{bureau.name}</span>
                  {bureau.abbr && <span className="text-muted-foreground/50">{bureau.abbr}</span>}
                </span>
              </SelectItem>
            ))}
          </div>
        ) : null)}
      </SelectContent>
    </Select>
  );
}