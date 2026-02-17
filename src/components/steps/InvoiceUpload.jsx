import { useRef, useState } from "react";
import StepWrapper from "../layout/StepWrapper";
import Spinner from "../ui/Spinner";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export default function InvoiceUpload({ state, analyseInvoice, dispatch }) {
  const { claim, ui } = state;
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      dispatch({ type: "SET_ERROR", message: "Please upload an image (JPG, PNG, WebP) or PDF." });
      return;
    }

    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    dispatch({ type: "SET_FILE", file, preview });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  function handleInputChange(e) {
    handleFile(e.target.files?.[0]);
  }

  async function handleAnalyse() {
    if (!claim.uploadedFile) return;
    await analyseInvoice(claim.uploadedFile);
  }

  if (ui.isLoading) {
    return (
      <StepWrapper title="Scanning Document">
        <div className="flex flex-col items-center py-8">
          {/* Document scanning animation */}
          <div className="relative mb-6 aspect-[3/4] w-48 overflow-hidden rounded-xl border-2 border-primary bg-gray-100">
            {/* Corner brackets */}
            <div className="absolute left-2 top-2 h-6 w-6 border-l-4 border-t-4 border-primary rounded-tl-lg" />
            <div className="absolute right-2 top-2 h-6 w-6 border-r-4 border-t-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 h-6 w-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 h-6 w-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

            {/* Scanning line animation */}
            <div className="absolute left-4 right-4 top-0 h-0.5 animate-pulse bg-primary shadow-[0_0_15px_3px_rgba(61,92,255,0.6)]"
              style={{ animation: "scan 2s ease-in-out infinite" }}
            />

            {/* Processing chip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 backdrop-blur-md">
              <span className="text-xs font-medium text-white">Processing...</span>
            </div>
          </div>

          <p className="text-sm font-medium text-text-primary">Analysing your document</p>
          <p className="text-xs text-text-secondary">This may take a few seconds</p>
        </div>

        <style>{`
          @keyframes scan {
            0%, 100% { top: 10%; }
            50% { top: 85%; }
          }
        `}</style>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Upload Documents"
      description="Upload your medical bills and documents."
    >
      <div className="space-y-6">
        {/* Info banner */}
        <div className="rounded-xl border border-blue-100 bg-[#EBF5FF] p-4">
          <h3 className="mb-2 font-semibold text-text-primary">
            Please upload all your <span className="border-b-2 border-primary/50">medical bills and docs</span> to claim your reimbursement.
          </h3>
          <ul className="space-y-1.5 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span>Upload clear, printed invoices for Fast Track processing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span>Handwritten bills will not be accepted.</span>
            </li>
          </ul>
        </div>

        {/* Invoice upload card */}
        <div className={`rounded-2xl border p-4 shadow-sm transition-all ${
          claim.uploadedFile
            ? "border-teal/30 bg-mint-green"
            : "border-red-100 bg-red-50"
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm ${
                claim.uploadedFile
                  ? "border-teal/30 bg-teal text-white"
                  : "border-red-100 bg-white text-coral"
              }`}>
                <span className="material-icons-round">receipt_long</span>
              </div>
              <div>
                <h3 className="font-bold text-text-primary">
                  INVOICE {!claim.uploadedFile && <span className="ml-1 text-xs font-normal text-coral">*Required</span>}
                </h3>
                {claim.uploadedFile ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal/20 px-2 py-0.5 text-xs font-medium text-teal">
                    <span className="material-icons-round text-sm">check_circle</span>
                    Uploaded
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Pending
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
            >
              {claim.uploadedFile ? "Replace" : "Upload"}
            </button>
          </div>

          {/* Preview or instructions */}
          {claim.uploadedFile ? (
            <div className="mt-4 rounded-xl border border-white/50 bg-white p-3">
              <div className="flex items-center gap-3">
                {claim.filePreview ? (
                  <img
                    src={claim.filePreview}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                    <span className="material-icons-round text-2xl text-gray-400">description</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{claim.uploadedFile.name}</p>
                  <p className="text-xs text-text-secondary">{(claim.uploadedFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  onClick={() => dispatch({ type: "SET_FILE", file: null, preview: null })}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 hover:text-coral"
                >
                  <span className="material-icons-round text-xl">close</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-red-100 bg-white p-3">
              <p className="text-sm text-text-secondary leading-relaxed">
                Please upload the invoice here. Ensure it is clear and printed.
              </p>
            </div>
          )}
        </div>

        {/* Drop zone (hidden but functional) */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            dragOver
              ? "border-primary bg-primary-light"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <span className="material-icons-round mb-2 text-3xl text-text-secondary">cloud_upload</span>
          <p className="text-sm text-text-secondary">
            Drag & drop here, or{" "}
            <button
              onClick={() => inputRef.current?.click()}
              className="font-semibold text-primary hover:underline"
            >
              browse files
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-400">JPG, PNG, WebP, HEIC, PDF</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Error */}
        {ui.error && (
          <div className="flex gap-3 rounded-xl border border-red-200 bg-coral-light p-4">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-coral text-white">
              <span className="material-icons-round text-base">close</span>
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-deep-red">Upload Error</p>
              <p className="text-sm text-red-700">{ui.error}</p>
            </div>
            <button
              onClick={() => dispatch({ type: "SET_ERROR", message: null })}
              className="text-text-secondary hover:text-text-primary"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>
        )}

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={!claim.uploadedFile || ui.isLoading}
          className={`w-full rounded-xl py-4 text-base font-bold transition-all active:scale-[0.98] ${
            claim.uploadedFile
              ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover"
              : "cursor-not-allowed bg-gray-200 text-text-secondary"
          }`}
        >
          Scan & Review
          <span className="material-icons-round ml-2 align-middle text-xl">document_scanner</span>
        </button>
      </div>
    </StepWrapper>
  );
}
