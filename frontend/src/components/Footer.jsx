import React from "react";
import { Lock, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-5">
            <a href="#contact" className="font-medium text-foreground/80 transition hover:text-primary">Contact</a>
            <a href="#privacy" className="font-medium text-foreground/80 transition hover:text-primary">Privacy</a>
            <a href="#terms" className="font-medium text-foreground/80 transition hover:text-primary">Terms</a>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Lock className="h-3 w-3" />
            Secure &amp; Confidential · Files never stored
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              Made in India
              <Heart className="h-3.5 w-3.5 fill-accent text-accent" />
            </span>
            <span className="text-muted-foreground/70">© 2026 Saral Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
