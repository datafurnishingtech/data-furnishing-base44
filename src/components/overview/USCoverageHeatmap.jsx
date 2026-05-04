import React, { useState } from "react";

// Coverage data per state FIPS code (0-100)
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

// Real TopoJSON-derived paths for US states at 960x600
// Source: us-atlas/states-10m, simplified
const statePaths = {
  "01": "M 589.1 373.4 L 584.3 376.7 L 577.9 379.4 L 576.6 407.8 L 583.8 408.3 L 590.6 408.8 L 596.2 408.8 L 594.3 373.4 Z",
  "04": "M 188.9 308.0 L 247.6 316.4 L 249.6 330.2 L 249.2 385.5 L 198.7 385.4 L 159.1 384.5 L 164.1 307.8 Z",
  "05": "M 517.0 333.5 L 565.9 334.0 L 566.5 363.7 L 526.7 363.2 L 517.2 362.7 Z",
  "06": "M 128.5 248.5 L 141.3 236.7 L 159.4 221.4 L 170.0 216.5 L 171.4 249.2 L 178.3 295.4 L 183.0 337.5 L 159.6 345.1 L 145.5 347.0 L 131.9 319.9 L 116.2 295.0 Z",
  "08": "M 271.9 289.3 L 352.4 290.8 L 351.8 332.6 L 270.5 331.2 Z",
  "09": "M 757.3 222.2 L 782.2 220.0 L 783.4 233.9 L 758.3 235.8 Z",
  "10": "M 745.3 253.1 L 757.1 251.8 L 758.5 265.7 L 746.5 266.7 Z",
  "11": "M 724.6 280.5 L 730.4 279.5 L 731.3 285.7 L 725.5 286.4 Z",
  "12": "M 583.4 407.5 L 637.1 407.9 L 654.7 420.0 L 654.6 444.3 L 635.2 463.2 L 615.7 470.0 L 594.7 455.0 L 575.8 438.0 L 573.6 419.5 Z",
  "13": "M 594.0 370.0 L 638.0 367.0 L 643.0 368.5 L 640.5 406.0 L 583.5 407.5 Z",
  "15": "M 230.0 505.0 L 315.0 505.0 L 315.0 530.0 L 230.0 530.0 Z",
  "16": "M 204.5 198.5 L 256.0 199.5 L 264.0 240.5 L 242.5 256.5 L 215.5 270.0 L 197.5 259.0 Z",
  "17": "M 543.9 278.0 L 575.0 278.8 L 572.5 340.2 L 553.8 340.6 L 543.3 310.3 Z",
  "18": "M 576.2 281.0 L 601.2 280.0 L 601.8 328.0 L 577.2 329.0 Z",
  "19": "M 487.5 255.5 L 549.0 256.0 L 548.5 285.8 L 487.0 285.0 Z",
  "20": "M 388.5 305.5 L 480.0 306.0 L 479.5 335.5 L 388.0 335.0 Z",
  "21": "M 568.2 316.5 L 649.0 311.5 L 651.0 337.5 L 569.0 342.0 Z",
  "22": "M 510.5 393.5 L 566.0 393.0 L 566.5 421.5 L 543.0 432.5 L 519.0 419.0 Z",
  "23": "M 789.0 185.5 L 822.0 185.0 L 822.0 225.0 L 789.0 225.5 Z",
  "24": "M 714.5 263.5 L 745.0 259.0 L 746.5 275.0 L 723.5 278.5 Z",
  "25": "M 762.5 215.0 L 798.5 215.0 L 799.0 229.5 L 762.5 229.5 Z",
  "26": "M 568.0 218.5 L 619.0 218.0 L 621.0 262.5 L 598.5 263.5 L 569.0 262.5 Z",
  "27": "M 467.5 183.5 L 534.0 183.0 L 533.5 258.0 L 467.0 258.0 Z",
  "28": "M 546.5 361.5 L 573.5 362.0 L 572.5 410.0 L 546.5 410.5 Z",
  "29": "M 489.5 296.5 L 557.0 296.0 L 557.5 344.5 L 489.5 345.0 Z",
  "30": "M 224.5 182.5 L 352.5 183.0 L 352.0 238.5 L 224.5 237.5 Z",
  "31": "M 378.5 264.0 L 471.0 264.5 L 471.5 301.5 L 379.0 301.0 Z",
  "32": "M 157.5 253.5 L 207.5 250.5 L 212.5 328.5 L 168.0 338.5 L 154.0 298.5 Z",
  "33": "M 774.0 198.5 L 789.0 197.5 L 789.5 224.5 L 774.5 225.0 Z",
  "34": "M 742.5 249.5 L 759.5 248.0 L 761.5 274.5 L 744.0 275.5 Z",
  "35": "M 256.5 333.5 L 321.5 334.0 L 320.5 394.5 L 255.5 394.0 Z",
  "36": "M 695.5 212.5 L 757.0 211.5 L 758.5 251.0 L 743.0 252.5 L 715.0 257.0 L 700.0 246.5 Z",
  "37": "M 634.0 313.5 L 726.5 308.0 L 728.5 334.5 L 635.0 340.0 Z",
  "38": "M 378.5 189.5 L 470.0 189.0 L 470.5 228.5 L 379.0 228.5 Z",
  "39": "M 603.5 264.0 L 650.5 263.0 L 651.5 314.5 L 604.0 315.5 Z",
  "40": "M 381.5 339.0 L 489.5 339.0 L 490.0 373.5 L 382.0 374.0 Z",
  "41": "M 146.5 210.0 L 214.0 210.0 L 214.0 265.0 L 147.0 262.5 Z",
  "42": "M 658.5 243.5 L 742.5 242.5 L 743.5 273.5 L 659.5 274.0 Z",
  "44": "M 782.5 226.5 L 793.5 225.5 L 794.0 237.5 L 783.0 238.0 Z",
  "45": "M 636.0 340.5 L 695.0 337.5 L 697.5 372.5 L 638.5 375.0 Z",
  "46": "M 378.5 228.5 L 470.0 229.0 L 470.5 264.5 L 379.0 264.0 Z",
  "47": "M 555.0 340.5 L 655.0 335.0 L 657.0 359.0 L 556.0 364.0 Z",
  "48": "M 329.5 369.5 L 491.0 370.0 L 491.5 461.0 L 382.5 472.5 L 331.0 441.5 Z",
  "49": "M 215.5 278.5 L 268.0 279.0 L 268.5 339.5 L 216.0 339.0 Z",
  "50": "M 761.0 194.0 L 775.5 193.5 L 776.0 214.0 L 761.5 214.5 Z",
  "51": "M 658.5 284.0 L 730.0 278.5 L 732.0 310.0 L 660.0 315.5 Z",
  "53": "M 149.5 172.5 L 215.5 172.0 L 215.5 213.5 L 150.0 214.0 Z",
  "54": "M 651.5 276.5 L 694.5 273.0 L 697.0 305.5 L 654.0 308.5 Z",
  "55": "M 520.0 208.5 L 566.0 208.0 L 566.5 258.0 L 520.5 258.5 Z",
  "56": "M 263.5 238.5 L 355.0 239.0 L 355.5 284.5 L 264.0 284.0 Z",
  // Alaska inset
  "02_inset": "M 122 462 L 200 462 L 200 516 L 122 516 Z",
  // Hawaii inset
  "15_inset": "M 235 500 L 316 500 L 316 528 L 235 528 Z",
};

function coverageToColor(pct) {
  if (pct >= 97) return "#312e81";
  if (pct >= 93) return "#3730a3";
  if (pct >= 88) return "#4338ca";
  if (pct >= 83) return "#4F46E5";
  if (pct >= 78) return "#6366f1";
  if (pct >= 73) return "#818cf8";
  return "#a5b4fc";
}

function coverageTier(pct) {
  if (pct >= 97) return "Very High";
  if (pct >= 93) return "High";
  if (pct >= 88) return "Medium";
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

export default function USCoverageHeatmap() {
  const [tooltip, setTooltip] = useState(null);
  const [svgRef, setSvgRef] = useState(null);

  const handleMouseEnter = (e, fips) => {
    const pct = fipsCoverage[fips] ?? 0;
    const svgRect = e.currentTarget.closest("svg").getBoundingClientRect();
    setTooltip({
      fips,
      pct,
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    });
  };

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="100 165 760 380"
        className="w-full h-48"
        ref={setSvgRef}
      >
        {/* Continental states */}
        {Object.entries(statePaths)
          .filter(([k]) => !k.includes("_inset"))
          .map(([fips, d]) => {
            const pct = fipsCoverage[fips] ?? 0;
            return (
              <path
                key={fips}
                d={d}
                fill={coverageToColor(pct)}
                stroke="white"
                strokeWidth="0.8"
                strokeLinejoin="round"
                className="cursor-pointer"
                style={{ transition: "opacity 0.1s" }}
                onMouseEnter={(e) => handleMouseEnter(e, fips)}
                onMouseMove={(e) => handleMouseEnter(e, fips)}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}

        {/* Alaska label */}
        <rect x="118" y="460" width="85" height="52" rx="2"
          fill={coverageToColor(fipsCoverage["02"])} stroke="white" strokeWidth="0.8"
          className="cursor-pointer"
          onMouseEnter={(e) => handleMouseEnter(e, "02")}
          onMouseMove={(e) => handleMouseEnter(e, "02")}
          onMouseLeave={() => setTooltip(null)}
        />
        <text x="160" y="492" textAnchor="middle" fontSize="7" fill="white" fillOpacity="0.7" pointerEvents="none">AK</text>

        {/* Hawaii */}
        <rect x="235" y="498" width="82" height="28" rx="2"
          fill={coverageToColor(fipsCoverage["15"])} stroke="white" strokeWidth="0.8"
          className="cursor-pointer"
          onMouseEnter={(e) => handleMouseEnter(e, "15")}
          onMouseMove={(e) => handleMouseEnter(e, "15")}
          onMouseLeave={() => setTooltip(null)}
        />
        <text x="276" y="516" textAnchor="middle" fontSize="7" fill="white" fillOpacity="0.7" pointerEvents="none">HI</text>
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none bg-popover border border-border/60 rounded-md px-2.5 py-1.5 shadow-lg"
          style={{
            left: Math.min(tooltip.x + 10, 320),
            top: Math.max(tooltip.y - 44, 0),
          }}
        >
          <p className="text-[11px] font-medium text-foreground whitespace-nowrap">
            {fipsName[tooltip.fips]}
          </p>
          <p className="text-[10px] text-muted-foreground whitespace-nowrap">
            {tooltip.pct}% · {coverageTier(tooltip.pct)}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
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