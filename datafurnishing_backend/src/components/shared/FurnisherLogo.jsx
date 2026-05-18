import React, { useState } from "react";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const OVERRIDES = {
  "capitalone.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Capital_One_logo.svg/512px-Capital_One_logo.svg.png",
  "synchrony.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Synchrony_Financial_logo.svg/512px-Synchrony_Financial_logo.svg.png",
  "americanexpress.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/512px-American_Express_logo_%282018%29.svg.png",
  "citibank.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Citi.svg/512px-Citi.svg.png",
  "barclays.co.uk": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Barclays_logo.svg/512px-Barclays_logo.svg.png",
  "wellsfargo.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/512px-Wells_Fargo_Bank.svg.png",
  "discover.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Discover_Card_logo.svg/512px-Discover_Card_logo.svg.png",
  "ally.com": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ally_Financial_logo.svg/512px-Ally_Financial_logo.svg.png",
};

const logoSources = (domain, fallbackName) => {
  const sources = [];
  if (OVERRIDES[domain]) sources.push(OVERRIDES[domain]);
  if (domain) {
    sources.push(`https://logo.clearbit.com/${domain}`);
    sources.push(`https://www.google.com/s2/favicons?domain=https://${domain}&sz=128`);
  }
  if (!domain && fallbackName) {
    const nameDomain = fallbackName.toLowerCase().replace(/\s+/g, "");
    sources.push(`https://logo.clearbit.com/${nameDomain}`);
  }
  return sources;
};

export default function FurnisherLogo({ domain, name, size = "sm" }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const dim = size === "lg" ? "w-10 h-10" : size === "md" ? "w-8 h-8" : "w-7 h-7";
  const textSize = size === "lg" ? "text-[11px]" : "text-[9px]";
  const sources = logoSources(domain, name);

  if (srcIndex < sources.length) {
    return (
      <div className={`${dim} rounded-md bg-muted/60 flex items-center justify-center overflow-hidden shrink-0`}>
        <img
          src={sources[srcIndex]}
          alt={name}
          className="w-full h-full object-contain"
          onError={() => setSrcIndex((i) => i + 1)}
        />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-md bg-primary/10 flex items-center justify-center shrink-0`}>
      <span className={`${textSize} font-semibold text-primary`}>{initials(name || "?")}</span>
    </div>
  );
}