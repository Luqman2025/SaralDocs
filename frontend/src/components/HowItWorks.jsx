export default function HowItWorks() {
  const steps = [
    "Upload",
    "Process",
    "Break",
    "Analyze",
    "Highlight",
    "Result",
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-4">How It Works</h1>

      <p className="text-lg text-muted-foreground mb-10">
        Saral Docs helps you understand complex legal documents in a few simple steps.
        No legal knowledge required.
      </p>

      {/* EXISTING STEPS */}
      <div className="space-y-6 text-base md:text-lg">

        <div className="flex gap-4">
          <span className="font-semibold text-primary">1.</span>
          <p>
            Upload your document (PDF or Word file). Just drag and drop or select from your device.
          </p>
        </div>

        <div className="flex gap-4">
          <span className="font-semibold text-primary">2.</span>
          <p>
            We read and process the document automatically, preparing it for analysis.
          </p>
        </div>

        <div className="flex gap-4">
          <span className="font-semibold text-primary">3.</span>
          <p>
            The system breaks the document into smaller parts to understand each clause clearly.
          </p>
        </div>

        <div className="flex gap-4">
          <span className="font-semibold text-primary">4.</span>
          <p>
            Important clauses and risky sections are identified so you know what to focus on.
          </p>
        </div>

        <div className="flex gap-4">
          <span className="font-semibold text-primary">5.</span>
          <p>
            You get a simple explanation and summary in easy-to-understand language.
          </p>
        </div>

      </div>

      {/* WHAT YOU GET */}
      <div className="mt-12 p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-xl font-semibold mb-3">What you get</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Clear explanation of legal terms</li>
          <li>• Highlighted important sections</li>
          <li>• Easy-to-read summary</li>
          <li>• Better understanding before you sign anything</li>
        </ul>
      </div>

      {/* 🔥 PIPELINE SECTION */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold mb-6">How the system works internally</h2>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base">

          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">

              <div className="px-4 py-2 rounded-xl border border-border bg-card shadow-tactile font-medium">
                {step}
              </div>

              {index !== steps.length - 1 && (
                <span className="text-muted-foreground">→</span>
              )}

            </div>
          ))}

        </div>
      </div>

    </div>
  );
}