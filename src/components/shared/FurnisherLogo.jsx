import React, { useState } from "react";

const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2);

const logoSources = (domain) => [
  `https://img.logo.dev/${domain}?token=pk_f5OB1ayuQZekUv3LLHO2Dg&size=64&format=png`,
  `https://logo.clearbit.com/${domain}`,
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
];

export default function FurnisherLogo({ domain, name, size = "sm" }) {
  const [srcIndex, setSrcIndex] = useState(0);
  const dim = size === "lg" ? "w-10 h-10" : size === "md" ? "w-8 h-8" : "w-7 h-7";
  const textSize = size === "lg" ? "text-[11px]" : "text-[9px]";
  const sources = logoSources(domain);

  if (srcIndex < sources.length) {
    return (
      <div className={`${dim} rounded-md overflow-hidden bg-white border border-border/40 flex items-center justify-center flex-shrink-0`}>
        <img
          src={sources[srcIndex]}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={() => setSrcIndex((i) => i + 1)}
        />
      </div>
    );
  }
  return (
    <div className={`${dim} rounded-md bg-primary/10 flex items-center justify-center ${textSize} font-semibold text-primary flex-shrink-0`}>
      {initials(name)}
    </div>
  );
}