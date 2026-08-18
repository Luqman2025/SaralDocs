export default function Privacy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="text-lg text-muted-foreground mb-10">
        Your privacy and data security are our top priorities. Saral Docs is designed
        to process your documents safely without storing or sharing your information.
      </p>

      {/* KEY POINTS */}
      <div className="space-y-6 text-base md:text-lg">

        <div>
          <h2 className="font-semibold text-foreground mb-1">No Data Storage</h2>
          <p className="text-muted-foreground">
            Your uploaded documents are not stored on our servers. They are used only
            for temporary analysis and are discarded immediately after processing.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-1">Secure Processing</h2>
          <p className="text-muted-foreground">
            All files are processed securely. We ensure that your document content
            remains confidential during the analysis.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-1">No Third-Party Sharing</h2>
          <p className="text-muted-foreground">
            We do not share, sell, or transfer your data to any third parties.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-1">User Control</h2>
          <p className="text-muted-foreground">
            You are always in control of your documents. You can upload, analyze, and
            remove files at any time.
          </p>
        </div>

      </div>

      {/* NEW SECTION */}
      <div className="mt-10 space-y-6 text-base md:text-lg">

        <div>
          <h2 className="font-semibold text-foreground mb-1">Temporary Processing</h2>
          <p className="text-muted-foreground">
            Documents are processed only for the duration required to generate results.
            Once the analysis is complete, the data is not retained or reused.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-1">Purpose of Use</h2>
          <p className="text-muted-foreground">
            Your document content is used solely to provide analysis, summaries, and
            insights. It is never used for training or any unrelated purposes.
          </p>
        </div>

      </div>

      {/* NOTE */}
      <div className="mt-10 p-5 rounded-xl border border-border bg-secondary/40 text-sm text-muted-foreground">
        Note: This application is designed for educational and demonstration purposes.
        Avoid uploading highly sensitive or confidential documents.
      </div>

    </div>
  );
}