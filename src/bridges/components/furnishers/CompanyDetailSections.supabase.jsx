import React, { useState } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import {
  formatLabel,
  formatBoolean,
  cleanHumanText,
  isQualityText,
  pickBestEvidence,
  prioritizeCrawlUrls,
  extractTradelineSummary,
  extractEnrichmentHighlights,
  buildPrimaryLinks,
  ensureUrl,
} from "@/bridges/lib/companyDetailFormatters";

function Row({ label, children, compact }) {
  if (children == null || children === "" || children === false) return null;
  if (compact) {
    return (
      <div>
        <p className="text-[9.5px] text-muted-foreground/60">{label}</p>
        <div className="text-[10.5px] font-medium text-foreground break-words leading-snug">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border/25 last:border-0">
      <span className="text-[10px] text-muted-foreground/60 shrink-0 pt-0.5">{label}</span>
      <span className="text-[11px] text-foreground/90 text-right break-words min-w-0 max-w-[72%] leading-snug">{children}</span>
    </div>
  );
}

function LinkChip({ href, label }) {
  const url = ensureUrl(href);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/8 text-primary text-[10px] font-medium hover:bg-primary/12 transition-colors"
    >
      {label}
      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
    </a>
  );
}

function Section({ title, children, compact }) {
  const items = React.Children.toArray(children).filter(Boolean);
  if (!items.length) return null;
  return (
    <div className={compact ? "pt-3 border-t border-border/40 first:border-0 first:pt-0" : "pt-4 border-t border-border/30 first:border-0 first:pt-0"}>
      <h4 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-[0.08em] mb-2.5">{title}</h4>
      {children}
    </div>
  );
}

function StatPill({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 px-2.5 py-2 min-w-0">
      <p className="text-[9px] text-muted-foreground/55 uppercase tracking-wide truncate">{label}</p>
      <p className="text-[11px] font-medium text-foreground mt-0.5 leading-tight">{value}</p>
    </div>
  );
}

function EvidenceCard({ item }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-3">
      {item.title && <p className="text-[11px] font-medium text-foreground leading-snug">{item.title}</p>}
      {item.snippet && (
        <p className="text-[10.5px] text-muted-foreground/75 mt-1.5 leading-relaxed">{item.snippet}</p>
      )}
      {item.url && (
        <p className="mt-2">
          <LinkChip href={item.url} label={item.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]} />
        </p>
      )}
    </div>
  );
}

function CollapsibleUrls({ urls, total, compact }) {
  const [open, setOpen] = useState(false);
  if (!urls.length) return null;

  return (
    <div className={compact ? "col-span-2" : ""}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide" : "Show"} reference URLs ({total})
      </button>
      {open && (
        <ul className="mt-2 space-y-1 max-h-36 overflow-y-auto rounded-md border border-border/40 bg-muted/15 p-2">
          {urls.map((url) => (
            <li key={url} className="text-[10px]">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary/80 hover:text-primary break-all">
                {url.replace(/^https?:\/\//, "")}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CompanyDetailSections({ company, compact = false }) {
  if (!company) return null;

  const primaryLinks = buildPrimaryLinks(company);
  const evidence = pickBestEvidence(company.evidence_sources, compact ? 1 : 2);
  const enrichmentRows = extractEnrichmentHighlights(company.enrichment_data);
  const tradelineRows = extractTradelineSummary(company.raw_tradline_info);
  const { urls: refUrls, total: refTotal } = prioritizeCrawlUrls(company.crawl_source_urls, compact ? 4 : 8);

  const aboutText =
    cleanHumanText(company.long_description, 400) ||
    cleanHumanText(company.short_description, 300);
  const reasonText = cleanHumanText(company.reason, 220);
  const notesText = cleanHumanText(company.source_notes, 180);
  const evidenceSnippet = isQualityText(company.source_evidence_snippet)
    ? cleanHumanText(company.source_evidence_snippet, 220)
    : "";

  const bureaus = company.detected_bureaus
    ? String(company.detected_bureaus).split(/[,;]/).map((b) => b.trim()).filter(Boolean)
    : [];

  const showRefUrls = refTotal > primaryLinks.length + 2;

  return (
    <>
      {/* At a glance */}
      <Section title="At a glance" compact={compact}>
        <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
          <StatPill label="Verification" value={formatLabel(company.verification_status)} />
          <StatPill label="Furnisher" value={formatLabel(company.furnisher_status)} />
          <StatPill label="Reporting" value={formatLabel(company.reporting_relationship)} />
          <StatPill label="Lane" value={formatLabel(company.lane || company.entity_type)} />
        </div>
        {bureaus.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {bureaus.map((b) => (
              <span key={b} className="text-[9.5px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 font-medium">
                {b}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Contact */}
      <Section title="Contact" compact={compact}>
        <div className={compact ? "grid grid-cols-2 gap-y-2 gap-x-3" : "space-y-0"}>
          <Row label="Email" compact={compact}>
            {company.support_email ? (
              <a href={`mailto:${company.support_email}`} className="hover:text-primary break-all">
                {company.support_email}
              </a>
            ) : null}
          </Row>
          <Row label="Phone" compact={compact}>{company.phone}</Row>
        </div>
        {primaryLinks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {primaryLinks.map((l) => (
              <LinkChip key={l.url} href={l.url} label={l.label} />
            ))}
          </div>
        )}
      </Section>

      {/* About */}
      {(aboutText || reasonText) && (
        <Section title="About" compact={compact}>
          {aboutText && (
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{aboutText}</p>
          )}
          {reasonText && reasonText !== aboutText && (
            <p className="text-[10.5px] text-foreground/75 leading-relaxed mt-2">{reasonText}</p>
          )}
          {notesText && (
            <p className="text-[10px] text-muted-foreground/55 mt-2 italic">{notesText}</p>
          )}
        </Section>
      )}

      {/* Reporting */}
      <Section title="Reporting & capabilities" compact={compact}>
        <div className={compact ? "grid grid-cols-2 gap-y-2 gap-x-3" : "space-y-0"}>
          <Row label="Capabilities" compact={compact}>
            {company.reporting_capabilities ? (
              <span className={compact ? "" : "block text-left"}>{company.reporting_capabilities}</span>
            ) : null}
          </Row>
          <Row label="API available" compact={compact}>{formatBoolean(company.api_available)}</Row>
          <Row label="Partner program" compact={compact}>{formatBoolean(company.partner_program)}</Row>
          <Row label="Requirements public" compact={compact}>{formatBoolean(company.requirements_public)}</Row>
          <Row label="Pricing public" compact={compact}>{formatBoolean(company.pricing_public)}</Row>
          {!compact && (company.headquarters_location || company.state || company.country) && (
            <Row label="Location">
              {[company.headquarters_location, company.state, company.country].filter(Boolean).join(", ")}
            </Row>
          )}
        </div>
      </Section>

      {/* Requirements from enrichment */}
      {enrichmentRows.length > 0 && (
        <Section title="Requirements & eligibility" compact={compact}>
          <div className="space-y-2">
            {enrichmentRows.map((row) => (
              <div key={row.label}>
                {row.type === "list" ? (
                  <div>
                    <p className="text-[9.5px] text-muted-foreground/60 mb-1">{row.label}</p>
                    <ul className="list-disc list-inside text-[10.5px] text-foreground/85 space-y-0.5">
                      {row.value.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : row.type === "url" ? (
                  <Row label={row.label} compact={compact}>
                    <LinkChip href={row.value} label="Open" />
                  </Row>
                ) : (
                  <div>
                    <p className="text-[9.5px] text-muted-foreground/60">{row.label}</p>
                    <p className="text-[10.5px] text-foreground/85 leading-relaxed mt-0.5">{row.value}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Best evidence only */}
      {(evidence.length > 0 || evidenceSnippet || company.source_evidence_title) && (
        <Section title="Source evidence" compact={compact}>
          {(() => {
            const title = cleanHumanText(company.source_evidence_title, 120);
            if (!title || !isQualityText(title)) return null;
            return (
              <EvidenceCard
                item={{
                  title,
                  snippet: evidenceSnippet,
                  url: company.source_url || company.website_url,
                }}
              />
            );
          })()}
          {evidence
            .filter((e) => e.title !== cleanHumanText(company.source_evidence_title, 120))
            .map((item, i) => (
              <EvidenceCard key={`${item.url}-${i}`} item={item} />
            ))}
        </Section>
      )}

      {/* Tradeline summary (curated) */}
      {tradelineRows.length > 0 && (
        <Section title="Tradeline assessment" compact={compact}>
          <div className={compact ? "grid grid-cols-2 gap-y-2 gap-x-3" : "space-y-0"}>
            {tradelineRows.map((row) => (
              <Row key={row.label} label={row.label} compact={compact}>
                {row.value}
              </Row>
            ))}
          </div>
        </Section>
      )}

      {/* Collapsed reference URLs */}
      {showRefUrls && (
        <Section title="More references" compact={compact}>
          <CollapsibleUrls urls={refUrls} total={refTotal} compact={compact} />
        </Section>
      )}
    </>
  );
}
