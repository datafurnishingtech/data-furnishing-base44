import React, { useState, useEffect, useRef } from "react";
import { geoAlbersUsa, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const fipsCoverage = {
  "01": 91, "02": 72, "04": 96, "05": 88, "06": 99, "08": 97, "09": 98,
  "10": 95, "11": 99, "12": 99, "13": 97, "15": 83, "16": 89, "17": 99,
  "18": 94, "19": 90, "20": 88, "21": 92, "22": 89, "23": 87, "24": 98,
  "25": 99, "26": 96, "27": 95, "28": 85, "29": 93, "30": 79, "31": 88,
  "32": 94, "33": 93, "34": 98, "35": 86, "36": 99, "37": 96, "38": 78,
  "39": 97, "40": 89, "41": 94, "42": 98, "44": 96, "45": 92, "46": 80,
  "47": 93, "48": 99, "49": 95, "50": 85, "51": 97, "53": 96, "54": 87,
  "55": 94, "56": 75,
};

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

function coverageToColor(pct) {
  if (pct >= 97) return "#312e81";
  if (pct >= 93) return "#3730a3";
  if (pct >= 88) return "#4338ca";
  if (pct >= 83) return "#4F46E5";
  if (pct >= 78) return "#6366f1";
  return "#a5b4fc";
}

function coverageTier(pct) {
  if (pct >= 97) return "Very High";
  if (pct >= 93) return "High";
  if (pct >= 88) return "Medium-High";
  if (pct >= 83) return "Medium";
  if (pct >= 78) return "Low";
  return "Minimal";
}

const legend = [
  { label: "97%+", color: "#312e81" },
  { label: "93–96%", color: "#3730a3" },
  { label: "88–92%", color: "#4338ca" },
  { label: "83–87%", color: "#4F46E5" },
  { label: "78–82%", color: "#6366f1" },
  { label: "<78%", color: "#a5b4fc" },
];

const WIDTH = 600;
const HEIGHT = 380;

export default function USCoverageHeatmap() {
  const [states, setStates] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((r) => r.json())
      .then((us) => {
        if (!isMounted) return;
        const featureCollection = feature(us, us.objects.states);
        setStates(featureCollection.features);
      })
      .catch(() => {
        if (isMounted) setStates([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const projection = geoAlbersUsa().scale(780).translate([WIDTH / 2, HEIGHT / 2]);
  const pathGenerator = geoPath().projection(projection);

  const handleMouseMove = (e, fips) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = WIDTH / svgRect.width;
    const scaleY = HEIGHT / svgRect.height;
    setTooltip({
      fips,
      pct: fipsCoverage[fips] ?? 0,
      x: (e.clientX - svgRect.left) * scaleX,
      y: (e.clientY - svgRect.top) * scaleY,
    });
  };

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        style={{ height: 190 }}
      >
        {states.map((s) => {
          const fips = s.id.toString().padStart(2, "0");
          const pct = fipsCoverage[fips] ?? 0;
          return (
            <path
              key={fips}
              d={pathGenerator(s)}
              fill={coverageToColor(pct)}
              stroke="white"
              strokeWidth="0.6"
              strokeLinejoin="round"
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseMove={(e) => handleMouseMove(e, fips)}
              onMouseLeave={() => setTooltip(null)}
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
          <p className="text-[11px] font-medium text-foreground whitespace-nowrap">
            {fipsName[tooltip.fips] ?? "Unknown"}
          </p>
          <p className="text-[10px] text-muted-foreground whitespace-nowrap">
            {tooltip.pct}% · {coverageTier(tooltip.pct)}
          </p>
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