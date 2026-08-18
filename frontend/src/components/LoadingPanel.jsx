import React from "react";
import { FileSearch, Cpu, CheckCheck } from "lucide-react";

const steps = [
  { icon: FileSearch, label: "Parsing document", delay: "0ms" },
  { icon: Cpu, label: "Interpreting clauses", delay: "300ms" },
  { icon: CheckCheck, label: "Drafting plain-English summary", delay: "600ms" },
];

export default function LoadingPanel({ fileName }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 shadow-tactile">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
        <span className="absolute inset-3 rounded-full border border-primary/40" />
        <span
          className="absolute inset-1 rounded-full border-2 border-transparent border-t-primary"
          style={{ animation: "spin 1.2s linear infinite" }}
        />
        <FileSearch className="relative h-8 w-8 text-primary" />
      </div>

      <h3 className="font-display text-xl font-medium tracking-tight text-foreground">
        Analyzing your document
      </h3>
      {fileName && (
        <p className="mt-1 max-w-sm truncate font-mono text-xs text-muted-foreground">
          {fileName}
        </p>
      )}

      <ul className="mt-8 w-full max-w-sm space-y-3">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 opacity-0 animate-fadeup"
            style={{ animationDelay: s.delay, animationFillMode: "forwards" }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <s.icon className="h-4 w-4" />
            </span>
            <span className="text-sm text-foreground/80">{s.label}</span>
            <span className="ml-auto h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                style={{ backgroundSize: "200% 100%" }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
