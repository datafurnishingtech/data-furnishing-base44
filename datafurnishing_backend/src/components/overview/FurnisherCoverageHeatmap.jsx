import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { getCompanyStateCountsMap, listCompaniesPaged } from "@/services/intelligenceService";
import { canonicalStateNameFromDb } from "@/lib/usStates";
import FurnisherLogo from "@/components/shared/FurnisherLogo";
import { X } from "lucide-react";

const fipsName = {
  "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas", "06": "California",
  "08": "Colorado", "09": "Connecticut", "10": "Delaware", "11": "D.C.", "12": "Florida",
  "13": "Georgia", "15": "Hawaii", "16": "Idaho", "17": "Illinois", "18": "Indiana",
  "19": "Iowa", "20": "Kansas", "21": "Kentucky", "22": "Louisiana", "23": "Maine",
  "24": "Maryland", "25": "Massachusetts", "26": "Michigan", "27": "Minnesota",
  "28": "Mississippi", "29": "Missouri", "30": "Montana", "31": "Nebraska", "32": "Nevada",
  "33": "New Hampshire", "34": "New Jersey", "35": "New Mexico", "36": "New York",
  "37": "North Carolina", "38": "North Dakota", "39": "Ohio", "40": "Oklahoma",
  "41": "Oregon", "42": "Pennsylvania", "44": "Rhode Island", "45": "South Carolina",
  "46": "South Dakota", "47": "Tennessee", "48": "Texas", "49": "Utah", "50": "Vermont",
  "51": "Virginia", "53": "Washington", "54": "West Virginia", "55": "Wisconsin", "56": "Wyoming",
};

const stateAbbrevToName = { AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"D.C.",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming" };
const nameToAbbrev = Object.fromEntries(Object.entries(stateAbbrevToName).map(([a, n]) => [n, a]));

const WIDTH = 600;
const HEIGHT = 380;

function countToColor(count, maxCount) {
  if (count === 0) return "#e5e7eb";
  const intensity = Math.min(count / Math.max(maxCount, 1), 1);
  if (intensity >= 0.8) return "#312e81";
  if (intensity >= 0.6) return "#3730a3";
  if (intensity >= 0.4) return "#4338ca";
  if (intensity >= 0.2) return "#4F46E5";
  if (intensity >= 0.05) return "#6366f1";
  return "#a5b4fc";
}

const legend = [
  { label: "High", color: "#312e81" }, { label: "Med-High", color: "#4338ca" },
  { label: "Medium", color: "#4F46E5" }, { label: "Low", color: "#6366f1" },
  { label: "Minimal", color: "#a5b4fc" }, { label: "None", color: "#e5e7eb" },
];

export default function FurnisherCoverageHeatmap({ typeFilter = "all", selectedState, onStateSelect }) {
  const [geoStates, setGeoStates] = React.useState([]);
  const [tooltip, setTooltip] = React.useState(null);
  const svgRef = React.useRef(null);

  React.useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((r) => r.json())
      .then((us) => setGeoStates(feature(us, us.objects.states).features));
  }, []);

  const { data: countsByAbbrev, isLoading } = useQuery({
    queryKey: ["heatmap-state-counts", typeFilter],
    queryFn: () => getCompanyStateCountsMap(typeFilter),
    staleTime: 120_000,
  });

  const stateCounts = useMemo(() => {
    const out = {};
    if (!countsByAbbrev || typeof countsByAbbrev !== "object") return out;
    for (const [key, cnt] of Object.entries(countsByAbbrev)) {
      const stateName = canonicalStateNameFromDb(String(key)) || stateAbbrevToName[String(key).trim().toUpperCase()];
      if (!stateName) continue;
      const n = Number(cnt);
      out[stateName] = (out[stateName] || 0) + (Number.isFinite(n) ? n : 0);
    }
    return out;
  }, [countsByAbbrev]);

  const maxCount = useMemo(() => Math.max(...Object.values(stateCounts), 1), [stateCounts]);

  const { data: previewCompanies = [] } = useQuery({
    queryKey: ["heatmap-state-preview", selectedState?.abbr, typeFilter],
    queryFn: () => listCompaniesPaged({ page: 1, pageSize: 10, state: selectedState?.abbr, companyType: typeFilter === "all" ? "all" : typeFilter, verificationStatus: "all", search: "" }).then((r) => r.rows),
    enabled: Boolean(selectedState?.abbr),
    staleTime: 60_000,
  });

  const projection = geoAlbersUsa().scale(780).translate([WIDTH / 2, HEIGHT / 2]);
  const pathGenerator = geoPath().projection(projection);

  const handleMouseMove = (e, fips) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const stateName = fipsName[fips];
    const count = stateCounts[stateName] || 0;
    setTooltip({ fips, stateName, count, x: (e.clientX - svgRect.left) * (WIDTH / svgRect.width), y: (e.clientY - svgRect.top) * (HEIGHT / svgRect.height) });
  };

  const handleClick = (fips) => {
    const stateName = fipsName[fips];
    if (selectedState?.name === stateName) { onStateSelect(null); return; }
    const stateAbbr = nameToAbbrev[stateName] || stateName;
    onStateSelect({ name: stateName, abbr: stateAbbr });
  };

  if (isLoading) return <div className="h-40 flex items-center justify-center text-muted-foreground text-[11px]">Loading heatmap…</div>;

  return (
    <div>
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">
        {geoStates.map((s) => {
          const fips = s.id.toString().padStart(2, "0");
          const stateName = fipsName[fips];
          const count = stateCounts[stateName] || 0;
          const isSelected = selectedState?.name === stateName;
          return (
            <path key={fips} d={pathGenerator(s)}
              fill={countToColor(count, maxCount)}
              stroke={isSelected ? "#f59e0b" : "white"}
              strokeWidth={isSelected ? 2 : 0.5}
              onMouseMove={(e) => handleMouseMove(e, fips)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => handleClick(fips)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          );
        })}
        {tooltip && (
          <g>
            <rect x={tooltip.x - 70} y={tooltip.y - 44} width={140} height={40} rx={4} fill="rgba(0,0,0,0.85)" />
            <text x={tooltip.x} y={tooltip.y - 26} textAnchor="middle" fill="white" fontSize={10} fontWeight={600}>{tooltip.stateName}</text>
            <text x={tooltip.x} y={tooltip.y - 12} textAnchor="middle" fill="#a5b4fc" fontSize={9}>{tooltip.count > 0 ? `${tooltip.count} furnisher${tooltip.count !== 1 ? "s" : ""} mapped` : "No furnishers mapped"}</text>
          </g>
        )}
      </svg>

      <div className="flex items-center gap-3 flex-wrap mt-1">
        {legend.map((t) => (
          <div key={t.label} className="flex items-center gap-1">
            <div className="w-3 h-2 rounded" style={{ background: t.color }} />
            <span className="text-[9px] text-muted-foreground">{t.label}</span>
          </div>
        ))}
      </div>

      {selectedState && (
        <div className="mt-3 bg-muted/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold">{selectedState.name}</span>
            <button onClick={() => onStateSelect(null)} className="text-muted-foreground/40 hover:text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
          </div>
          {previewCompanies.length === 0
            ? <p className="text-[10px] text-muted-foreground/60">No furnishers mapped for this state</p>
            : previewCompanies.slice(0, 5).map((c) => (
              <div key={c.company_id} className="flex items-center justify-between py-1 border-b border-border/20 last:border-0">
                <span className="text-[10.5px]">{c.company_name}</span>
                <span className={`text-[9px] ${c.verification_status === "verified" ? "text-emerald-600" : "text-muted-foreground/50"}`}>{c.verification_status === "verified" ? "Verified" : "Unverified"}</span>
              </div>
            ))}
          <Link to={`/furnishers?state=${selectedState.abbr}`} className="text-[10px] text-primary hover:underline mt-2 block">Open full registry for this state →</Link>
        </div>
      )}
    </div>
  );
}