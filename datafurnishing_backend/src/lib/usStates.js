export const US_STATE_ABBREV_TO_NAME = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "D.C.", FL: "Florida",
  GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana",
  IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine",
  MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
  OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

const NAME_TO_CANONICAL = {};
for (const [abbr, name] of Object.entries(US_STATE_ABBREV_TO_NAME)) {
  NAME_TO_CANONICAL[name.toLowerCase()] = name;
  NAME_TO_CANONICAL[abbr.toLowerCase()] = name;
}
NAME_TO_CANONICAL["district of columbia"] = "D.C.";
NAME_TO_CANONICAL["washington dc"] = "D.C.";
NAME_TO_CANONICAL["washington d.c."] = "D.C.";

export function canonicalStateNameFromDb(raw) {
  if (raw == null || typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t) return null;
  const upper = t.toUpperCase();
  if (US_STATE_ABBREV_TO_NAME[upper]) return US_STATE_ABBREV_TO_NAME[upper];
  const byName = NAME_TO_CANONICAL[t.toLowerCase()];
  if (byName) return byName;
  if (t === "D.C." || t === "DC") return "D.C.";
  return null;
}

export function expandCompanyStateVariants(stateParam) {
  if (!stateParam || !String(stateParam).trim()) return null;
  const t = String(stateParam).trim();
  const variants = new Set();
  variants.add(t);
  const upper = t.toUpperCase();
  variants.add(upper);
  const canon = canonicalStateNameFromDb(t);
  if (canon) {
    variants.add(canon);
    const abbr = Object.entries(US_STATE_ABBREV_TO_NAME).find(([, n]) => n === canon)?.[0];
    if (abbr) variants.add(abbr);
    if (canon === "D.C.") {
      variants.add("DC");
      variants.add("District of Columbia");
    }
  }
  return [...variants];
}