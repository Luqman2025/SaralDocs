export default function SupportedDocs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-4">Supported Documents</h1>

      <p className="text-lg text-muted-foreground mb-10">
        You can upload a variety of common legal and official documents.
        Our system is designed to understand and simplify them for you.
      </p>

      {/* FILE TYPES */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">File Types</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="font-medium">PDF (.pdf)</p>
            <p className="text-sm text-muted-foreground">
              Most commonly used format for legal and official documents.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="font-medium">Word Documents (.docx)</p>
            <p className="text-sm text-muted-foreground">
              Editable documents such as agreements and drafts.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="font-medium">Text Files (.txt)</p>
            <p className="text-sm text-muted-foreground">
              Simple text-based legal content.
            </p>
          </div>
        </div>
      </div>

      {/* DOCUMENT TYPES */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Common Documents You Can Upload</h2>

        <ul className="space-y-3 text-muted-foreground">
          <li>• Rent Agreements</li>
          <li>• Sale Deeds</li>
          <li>• Affidavits</li>
          <li>• Legal Notices</li>
          <li>• Contracts and MoUs</li>
          <li>• Government Documents</li>
        </ul>
      </div>

      {/* NOTE */}
      <div className="mt-10 p-5 rounded-xl border border-border bg-secondary/40 text-sm text-muted-foreground">
        Note: Make sure your document is clear and readable for best results.
      </div>

    </div>
  );
}