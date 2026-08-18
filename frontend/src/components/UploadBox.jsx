import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X, ArrowRight, Loader2 } from "lucide-react";

const MAX_BYTES = 25 * 1024 * 1024;
const ACCEPTED = [".pdf", ".docx", ".txt"];
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function UploadBox({ file, setFile, setLoading, setMode, setResult }) {
  const fileInputRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = (f) => {
    if (!f) return "Please select a file.";
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) return "Only PDF, DOCX, and TXT are supported.";
    if (f.size > MAX_BYTES) return "File exceeds 25 MB limit.";
    return "";
  };

  const handleFile = (f) => {
    const err = validate(f);
    if (err) { setError(err); return; }
    setError("");
    setFile(f);
  };

  const onFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) { setError("Please upload a document first."); return; }
    setError("");
    setSubmitting(true);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/process`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Document analysis failed.");
      }
      setResult(data);
      setMode("result");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || `Couldn't reach the analysis service. Make sure your backend is running at ${API_URL}.`);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4" id="upload">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          <span className="text-primary">01 /</span> Upload your document
        </h3>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          "group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-5 transition-all duration-200",
          dragOver ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/60 hover:bg-secondary/40",
        ].join(" ")}
        role="button"
        tabIndex={0}
      >
        <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-foreground/20" />
        <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-foreground/20" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-foreground/20" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-foreground/20" />

        {!file ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-1">
              <UploadCloud className="h-7 w-7" strokeWidth={2} />
            </div>
            <p className="font-display text-lg font-medium text-foreground">Drop your legal document here</p>
            <p className="mt-1 text-sm text-muted-foreground">
              or <span className="font-medium text-primary">click to browse</span>
            </p>
            <div className="mt-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-2 py-0.5">PDF</span>
              <span className="rounded-full border border-border bg-background px-2 py-0.5">DOCX</span>
              <span className="rounded-full border border-border bg-background px-2 py-0.5">TXT</span>
              <span>· Max 25 MB</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-tactile">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to analyze
              </p>
            </div>
            <button
              onClick={clearFile}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <input
          type="file"
          accept=".pdf,.docx,.txt"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onFileInput}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={submitting}
        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-foreground px-6 py-4 font-display text-base font-medium text-background shadow-tactile transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Analyze &amp; Simplify
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">Works with:</span>{" "}
        Rent Agreement · Sale Deed · Affidavit · Legal Notice · Contracts · MoUs
      </p>
    </div>
  );
}
