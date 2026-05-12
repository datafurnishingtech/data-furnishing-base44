import React, { useState, useEffect, useRef } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { base44 } from "@/api/base44Client";

const fipsName = {
  "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas",
  "06": "California", "08": "Colorado", "09": "Connecticut", "10": "Delaware",
  "11": "D.C.", "12": "Florida", "13": "Georgia", "15": "Hawaii",
  "16": "Idaho", "17": "Illinois", "18": "Indiana", "19": "Iowa",
  "20": "Kansas", "21": "Kentucky", "22": "Louisiana", "23": "Maine",
  "24": "Maryland", "25": "Massachusetts", "26": "Michigan", "27": "Minnesota",
  "28": "Mississippi", "29": "Missouri", "30": "Montana", "31": "Nebraska",
  "32": "Nevada", "33": "New Hampshire", "34": "New Jersey", "35": "New Mexico",
  "36": "New York", "37": "North Carolina", "38": "North Dakota", "39": "Ohio",
  "40": "Oklahoma", "41": "Oregon", "42": "Pennsylvania", "44": "Rhode Island",
  "45": "South Carolina", "46": "South Dakota", "47": "Tennessee", "48": "Texas",
  "49": "Utah", "50": "Vermont", "51": "Virginia", "53": "Washington",
  "54": "West Virginia", "55": "Wisconsin", "56": "Wyoming",
};

// Abbreviation → full name for the Company.state field
const stateAbbrevToName = {
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

export default function FurnisherCoverageHeatmap({ typeFilter = "all", selectedState, onStateSelect }) {
  const [geoStates, setGeoStates] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  const [stateCounts, setStateCounts] = useState({});
  const [maxCount, setMaxCount] = useState(1);
  const [globalMaxCount, setGlobalMaxCount] = useState(1);
  const svgRef = useRef(null);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then(r => r.json())
      .then(us => setGeoStates(feature(us, us.objects.states).features));
  }, []);

  // Fetch all companies once
  useEffect(() => {
    base44.entities.Company.list('-updated_date', 500)
      .then(companies => {
        setAllCompanies(companies || []);
        // Compute global max across ALL companies (no filter) for a stable color scale
        const counts = {};
        for (const c of (companies || [])) {
          if (!c.state) continue;
          const stateName = stateAbbrevToName[c.state] || c.state;
          counts[stateName] = (counts[stateName] || 0) + 1;
        }
        setGlobalMaxCount(Math.max(...Object.values(counts), 1));
      })
      .catch(() => {});
  }, []);

  // Recompute counts whenever companies or filter changes
  useEffect(() => {
    const filtered = typeFilter === "all"
      ? allCompanies
      : allCompanies.filter(c => c.company_type === typeFilter);

    const counts = {};
    for (const c of filtered) {
      if (!c.state) continue;
      const stateName = stateAbbrevToName[c.state] || c.state;
      counts[stateName] = (counts[stateName] || 0) + 1;
    }
    setStateCounts(counts);
    setMaxCount(globalMaxCount);
  }, [allCompanies, typeFilter, globalMaxCount]);

  const projection = geoAlbersUsa().scale(780).translate([WIDTH / 2, HEIGHT / 2]);
  const pathGenerator = geoPath().projection(projection);

  const handleMouseMove = (e, fips) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = WIDTH / svgRect.width;
    const scaleY = HEIGHT / svgRect.height;
    const stateName = fipsName[fips];
    const count = stateCounts[stateName] || 0;
    setTooltip({
      fips,
      stateName,
      count,
      x: (e.clientX - svgRect.left) * scaleX,
      y: (e.clientY - svgRect.top) * scaleY,
    });
  };

  const handleClick = (fips) => {
    const stateName = fipsName[fips];
    if (selectedState?.name === stateName) {
      onStateSelect(null);
    } else {
      const stateAbbr = nameToAbbrev[stateName] || stateName;
      onStateSelect({ name: stateName, abbr: stateAbbr });
    }
  };

  const legend = [
    { label: "High", color: "#312e81" },
    { label: "Med-High", color: "#4338ca" },
    { label: "Medium", color: "#4F46E5" },
    { label: "Low", color: "#6366f1" },
    { label: "Minimal", color: "#a5b4fc" },
    { label: "None", color: "#e5e7eb" },
  ];

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        style={{ height: 190 }}
      >
        {geoStates.map((s) => {
          const fips = s.id.toString().padStart(2, "0");
          const stateName = fipsName[fips];
          const count = stateCounts[stateName] || 0;
          const isSelected = selectedState?.name === stateName;
          return (
            <path
              key={fips}
              d={pathGenerator(s)}
              fill={isSelected ? "#f59e0b" : countToColor(count, maxCount)}
              stroke={isSelected ? "#d97706" : "white"}
              strokeWidth={isSelected ? "1.2" : "0.6"}
              strokeLinejoin="round"
              className="cursor-pointer transition-all hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, fips)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => handleClick(fips)}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none bg-popover border border-border/60 rounded-md px-2.5 py-1.5 shadow-lg"
          style={{
            left: `${(tooltip.x / WIDTH) * 100}%`,
            top: `${(tooltip.y / HEIGHT) * 190}px`,
            transform: "translate(8px, -110%)",
          }}
        >
          <p className="text-[11px] font-medium text-foreground whitespace-nowrap">{tooltip.stateName}</p>
          <p className="text-[10px] text-muted-foreground whitespace-nowrap">
            {tooltip.count > 0 ? `${tooltip.count} furnisher${tooltip.count !== 1 ? "s" : ""} mapped` : "No furnishers mapped"}
          </p>
          <p className="text-[9.5px] text-primary/60 whitespace-nowrap mt-0.5">Click to explore →</p>
        </div>
      )}

      <div className="flex items-center gap-3 mt-2 flex-wrap">
        {legend.map((t) => (
          <div key={t.label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: t.color }} />
            <span className="text-[9.5px] text-muted-foreground">{t.label}</span>
          </div>
        ))}
      </div>


    </div>
  );
}