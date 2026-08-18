import React from "react";
import { ShieldCheck, Languages, Zap } from "lucide-react";

export default function Hero() {
  return (
    <div className="pb-8">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground/70 shadow-sm backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        AI for Indian Legal Documents
      </div>

      <h1 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-[56px] lg:leading-[1.05]">
  Understand{" "}
  <span className="text-primary font-semibold">
    Indian Legal Documents
  </span>
  <br />
  in simple English.
</h1>
      

      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        From complex legal to clear understanding.
        We highlight what’s important so you don’t miss anything.
      </p>

      <ul className="mt-8 grid grid-cols-3 gap-3">
        {[
          { icon: ShieldCheck, title: "End-to-end", sub: "Private" },
          { icon: Languages, title: "English", sub: "More languages coming soon" },
          { icon: Zap, title: "< 30s", sub: "Per clause" },
        ].map((f, i) => (
          <li
            key={i}
            className="group rounded-2xl border border-border bg-card/80 p-3 shadow-tactile transition-transform duration-200 hover:-translate-y-0.5"
          >
            <f.icon className="mb-2 h-4 w-4 text-primary" strokeWidth={2.2} />
            <div className="text-sm font-medium text-foreground">{f.title}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {f.sub}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
