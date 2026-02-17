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
      <StepWrapper title="Analysing Invoice">
        <Spinner text="Analysing your document…" />
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Upload Invoice"
      description="Upload a clear photo or scan of your printed invoice."
    >
      <div className="space-y-5">
        {/* Drop zone */}
        <div
          onClick={() => !claim.uploadedFile && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
            dragOver
              ? "border-indigo-400 bg-indigo-50"
              : claim.uploadedFile
              ? "border-green-300 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          {claim.filePreview ? (
            /* Image preview */
            <div className="flex w-full flex-col items-center gap-3 p-4">
              <img
                src={claim.filePreview}
                alt="Invoice preview"
                className="max-h-56 rounded-lg object-contain shadow-sm"
              />
              <p className="text-xs text-gray-500">{claim.uploadedFile?.name}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "SET_FILE", file: null, preview: null });
                }}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          ) : claim.uploadedFile ? (
            /* PDF or non-image file */
            <div className="flex flex-col items-center gap-3 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100">
                <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.75 2.75a.75.75 0 00-1.5 0V11.25H3.75a.75.75 0 000 1.5h7.5V21.25a.75.75 0 001.5 0V12.75h7.5a.75.75 0 000-1.5h-7.5V2.75z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">{claim.uploadedFile.name}</p>
                <p className="text-xs text-gray-400">
                  {(claim.uploadedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "SET_FILE", file: null, preview: null });
                }}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <svg className="h-7 w-7 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Drop your invoice here, or{" "}
                  <span className="text-indigo-600">browse</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">Supports JPG, PNG, WebP, HEIC, PDF</p>
              </div>
            </div>
          )}
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
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-700">{ui.error}</p>
            <button
              onClick={() => dispatch({ type: "SET_ERROR", message: null })}
              className="mt-1 text-xs font-medium text-red-600 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Analyse button */}
        <button
          onClick={handleAnalyse}
          disabled={!claim.uploadedFile || ui.isLoading}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyse Invoice
        </button>
      </div>
    </StepWrapper>
  );
}
