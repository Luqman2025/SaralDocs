import React from "react";
import {
  FileText, Languages, Layers,
  ScrollText, RotateCcw, Sparkles, ShieldAlert,
} from "lucide-react";

export default function ResultPanel({ data, onReset }) {
  if (!data) return null;

  const clauses = data.legal_context || [];
  const isLegal = clauses.length > 0;
  const documentRisk = data.document_risk || "Not analyzed";

  const riskTone = (risk = "") => {
    const value = risk.toLowerCase();
    if (value === "high") return "bg-destructive text-destructive-foreground";
    if (value === "medium") return "bg-accent text-accent-foreground";
    if (value === "low") return "bg-emerald-700 text-white";
    return "bg-secondary text-secondary-foreground";
  };

  const riskBadgeTone = (risk = "") => {
    const value = risk.toLowerCase();
    if (value === "high") return "border-destructive/40 bg-destructive/10 text-destructive";
    if (value === "medium") return "border-accent/50 bg-accent/10 text-accent-foreground";
    if (value === "low") return "border-emerald-700/30 bg-emerald-50 text-emerald-800";
    return "border-border bg-secondary text-secondary-foreground";
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3 w-3" />
            Analysis Complete
          </div>
          <h2 className="font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Your document, decoded.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviewed clause-by-clause with plain-English explanations.
          </p>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:shadow-tactile"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          New document
        </button>
      </div>

      {/* ✅ SUMMARY GRID (NO RISK) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          icon={FileText}
          label="Document Type"
          value={(() => {
            const type = (data.document_type || "").toLowerCase().trim();

            if (!type || type === "extracted document")
              return "General Document";

            if (type.includes("leave") && type.includes("license"))
              return "Leave and License Agreement";

            if (type.includes("license"))
              return "License Agreement";

            if (type.includes("rent"))
              return "Rent Agreement";

            if (type.includes("agreement"))
              return "Agreement";

            return "General Document";
          })()}
          tone="bg-primary text-primary-foreground"
        />

        <SummaryCard
          icon={Languages}
          label="Language"
          value={"English"}
          tone="bg-foreground text-background"
        />

        <SummaryCard
          icon={Layers}
          label="Clauses"
          value={`${clauses.length} Clause${clauses.length === 1 ? "" : "s"}`}
          tone="bg-accent text-accent-foreground"
        />

        <SummaryCard
          icon={ShieldAlert}
          label="Risk"
          value={documentRisk}
          tone={riskTone(documentRisk)}
        />
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-tactile">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-display text-base font-medium text-foreground">
            <ScrollText className="mr-2 inline-block h-4 w-4 text-primary" />
            Clause-wise Analysis
          </h3>
          <span className="text-xs text-muted-foreground">
            {clauses.length} item{clauses.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="clause-scroll max-h-[560px] space-y-3 overflow-y-auto p-5">
          {clauses.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
              No clauses were extracted from this document.
            </div>
          )}

          {clauses.map((clause, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-background p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-tactile"
            >
              {/* ✅ HEADER (NO RISK BADGE) */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-background">
                  Clause {String(index + 1).padStart(2, "0")}
                </span>

                {clause.risk && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${riskBadgeTone(clause.risk)}`}>
                    {clause.risk} Risk
                    {typeof clause.risk_confidence === "number" &&
                      ` · ${Math.round(clause.risk_confidence * 100)}%`}
                  </span>
                )}

                {isLegal && clause.type && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
                    {clause.type}
                  </span>
                )}
              </div>

              {clause.original_clause && (
                <div className="mb-3 rounded-xl border border-dashed border-border/80 bg-secondary/50 p-3">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Original
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {clause.original_clause}
                  </p>
                </div>
              )}

              {clause.explanation && (
                <div>
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                    In simple English
                  </div>
                  <p className="text-[15px] leading-relaxed text-foreground">
                    {clause.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="px-1 text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground/80">Note:</span> Saral Docs
        provides informational summaries only and is not a substitute for legal
        advice. For material decisions, consult a licensed advocate.
      </p>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-tactile">
      <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-medium text-foreground truncate">
        {value}
      </div>
    </div>
  );
}
