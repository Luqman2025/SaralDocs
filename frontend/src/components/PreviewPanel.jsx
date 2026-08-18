import React from "react";
import { ShieldCheck, BookOpen } from "lucide-react";
import demoImg from "../image.png";

const floatingClauses = [
  {
    icon: ShieldCheck,
    label: "Obligation",
    text: "Tenant shall pay rent on or before the 5th of every month.",
    tone: "bg-primary text-primary-foreground",
    pos: "top-6 left-6",
    delay: "0ms",
  },
  {
    icon: BookOpen,
    label: "Right",
    text: "Tenant entitled to 30-day written notice before eviction.",
    tone: "bg-accent text-accent-foreground",
    pos: "bottom-24 right-6",
    delay: "200ms",
  }
];

export default function PreviewPanel() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Understand what your document really says.
          </div>
          <h2 className="font-display text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Watch AI read the fine print.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a file to replace this preview with your real analysis.
          </p>
        </div>
       
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-tactile">
        

<div className="scan-beam relative h-[460px] w-full overflow-hidden rounded-2xl border border-border">

  {/* IMAGE */}
  <img
  src={demoImg}
  alt="Document preview"
  className="absolute inset-0 h-full w-full object-cover"
/>

  {/* SOFT OVERLAY (reduced intensity) */}
  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />

  {/* TOP LEFT TAG */}
  <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-foreground/10 bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70 backdrop-blur">
    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
    Document · Rent Agreement
  </div>

  {/* TOP RIGHT TAG (FIXED) */}
  <div className="pointer-events-none absolute right-4 top-4 rounded-lg border border-foreground/10 bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70 backdrop-blur">
    Language: English
  </div>

  {/* CLAUSE CARDS */}
  {floatingClauses.map((c, i) => (
    <div
      key={i}
      className={`absolute ${c.pos} max-w-[260px] animate-floaty rounded-2xl border border-border bg-card p-3.5 shadow-xl backdrop-blur-sm`}
      style={{ animationDelay: c.delay }}
    >
      <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full ${c.tone} px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider`}>
        <c.icon className="h-3 w-3" />
        {c.label}
      </div>
      <p className="text-[13px] leading-snug text-foreground">{c.text}</p>
    </div>
  ))}

  {/* BOTTOM BAR (IMPROVED TEXT) */}
  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border/50 bg-background/85 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
    <span className="font-mono">Document ID: 0421</span>
    <span>3 clauses analyzed · 1 potential risk</span>
  </div>

</div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { k: "01", t: "Upload", d: "PDF or DOCX up to 2 MB" },
          { k: "02", t: "AI Analyze", d: "Clause-by-clause, multi-lingual" },
          { k: "03", t: "Understand", d: "Rights · risks · obligations" },
        ].map((s) => (
          <div
            key={s.k}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-tactile transition-transform hover:-translate-y-0.5"
          >
            <span className="font-mono text-xs font-semibold text-accent">{s.k}</span>
            <div>
              <div className="font-display text-sm font-medium text-foreground">{s.t}</div>
              <div className="text-xs text-muted-foreground">{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
