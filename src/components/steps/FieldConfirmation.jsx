import StepWrapper from "../layout/StepWrapper";
import EditableField from "../ui/EditableField";
import LineItemsTable from "../ui/LineItemsTable";
import ValidationBanner from "../ui/ValidationBanner";
import RoutingBanner from "../ui/RoutingBanner";
import { formatCurrency } from "../../utils/formatCurrency";

const FIELD_LABELS = {
  providerName: "Provider / Hospital Name",
  invoiceDate: "Invoice Date",
  totalAmount: "Total Amount (₹)",
  patientName: "Patient Name",
};

export default function FieldConfirmation({ state, submitClaim, editField, requestManualReview }) {
  const { extraction, validation, routing, claim } = state;
  const { fields } = extraction;

  const hasValidationAttempt = validation.attemptCount > 0;
  const isBlocked = hasValidationAttempt && !validation.passed;
  const isValidationPassed = hasValidationAttempt && validation.passed;
  const isLowConfidence = isValidationPassed && routing.tier === "LOW";
  const showManualReviewButton = isBlocked && validation.attemptCount >= 2;
  const isFastTrack = routing.tier === "HIGH";

  return (
    <StepWrapper>
      <div className="space-y-6">
        {/* Hero Status Section */}
        {isValidationPassed && !isLowConfidence && (
          <div className="flex flex-col items-center pt-2 pb-4 text-center">
            <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
              isFastTrack ? "bg-mint-green" : "bg-primary-light"
            }`}>
              <div className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
                isFastTrack ? "bg-teal shadow-teal/40" : "bg-primary shadow-primary/30"
              }`}>
                <span className="material-icons-round text-3xl text-white">
                  {isFastTrack ? "bolt" : "check"}
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-text-primary">
              {isFastTrack ? "Looks good!" : "Ready for Review"}
            </h1>

            <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
              isFastTrack ? "bg-teal/10" : "bg-primary/10"
            }`}>
              <span className={`material-icons-round text-sm ${isFastTrack ? "text-teal" : "text-primary"}`}>
                {isFastTrack ? "bolt" : "schedule"}
              </span>
              <span className={`text-xs font-bold uppercase tracking-wide ${
                isFastTrack ? "text-teal" : "text-primary"
              }`}>
                {isFastTrack ? "Fast Track Approved" : "Standard Review"}
              </span>
            </div>

            <p className="mt-3 max-w-[280px] text-sm text-text-secondary leading-relaxed">
              {isFastTrack ? (
                <>This claim qualifies for expedited review. Expect processing within <strong className="font-semibold text-text-primary">{routing.sla}</strong>.</>
              ) : (
                <>A reviewer will verify your claim. Expected processing: <strong className="font-semibold text-text-primary">{routing.sla}</strong>.</>
              )}
            </p>
          </div>
        )}

        {/* Amount Summary Card */}
        {fields.totalAmount?.value && (
          <div className="rounded-2xl border border-gray-100 bg-surface-light shadow-sm overflow-hidden">
            <div className="flex items-start justify-between border-b border-gray-100 bg-gray-50/50 p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Total Amount</p>
                <p className="text-3xl font-bold tracking-tight text-text-primary">
                  {formatCurrency(fields.totalAmount.value)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <span className="material-icons-round text-text-secondary">receipt_long</span>
              </div>
            </div>

            {/* Quick info */}
            <div className="flex gap-4 p-4">
              {claim.filePreview && (
                <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  <img src={claim.filePreview} alt="Receipt" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center gap-1">
                {fields.providerName?.value && (
                  <h3 className="text-lg font-bold text-text-primary">{fields.providerName.value}</h3>
                )}
                {fields.invoiceDate?.value && (
                  <p className="flex items-center gap-1 text-sm text-text-secondary">
                    <span className="material-icons-round text-base">calendar_today</span>
                    {fields.invoiceDate.value}
                  </p>
                )}
                <button className="mt-1 flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  <span className="material-icons-round text-base">edit</span>
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Details Section */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 px-1 text-base font-bold text-text-primary">
            <span className="material-icons-round text-lg text-text-secondary">fact_check</span>
            Review Details
          </h3>

          {/* Document type */}
          {extraction.documentType && (
            <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-50 p-3">
              <span className="text-sm text-text-secondary">Document Type</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize text-text-primary">{extraction.documentType}</span>
                {extraction.isHandwritten && (
                  <span className="rounded-full bg-coral-light px-2 py-0.5 text-xs font-medium text-coral">
                    Handwritten
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Editable fields */}
          <div className="space-y-3">
            {Object.entries(FIELD_LABELS).map(([key, label]) => (
              <EditableField
                key={key}
                label={label}
                fieldKey={key}
                fieldData={fields[key]}
                onEdit={editField}
              />
            ))}
            <LineItemsTable
              lineItemsField={fields.lineItems}
              onEdit={(key, val) => editField(key, val)}
            />
          </div>
        </div>

        {/* Overall notes from Gemini */}
        {extraction.overallNotes && (
          <div className="rounded-xl border border-blue-100 bg-[#EBF5FF] p-4">
            <div className="flex items-start gap-3">
              <span className="material-icons-round text-primary">smart_toy</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">AI Notes</p>
                <p className="text-sm text-text-secondary">{extraction.overallNotes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Validation errors/warnings — only shown after attempt */}
        {hasValidationAttempt && (
          <ValidationBanner errors={validation.errors} warnings={validation.warnings} />
        )}

        {/* Routing banner — shown after successful validation (if not already showing hero) */}
        {isValidationPassed && !isLowConfidence && !isFastTrack && (
          <RoutingBanner routing={routing} />
        )}

        {/* Low confidence blocked routing */}
        {isLowConfidence && (
          <div className="flex gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-400 text-white">
              <span className="material-icons-round">warning</span>
            </div>
            <div>
              <p className="font-bold text-orange-800">Manual Review Required</p>
              <p className="mt-1 text-sm text-orange-700">
                Confidence score too low for automated processing ({Math.round(routing.averageConfidence * 100)}%). Please request manual review.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Submit button */}
          {!isLowConfidence && (
            <button
              onClick={submitClaim}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              {isValidationPassed ? "Submit Claim" : "Submit Claim"}
              <span className="material-icons-round text-xl">send</span>
            </button>
          )}

          {/* Manual review — always available after failures or on low confidence */}
          {(showManualReviewButton || isLowConfidence) ? (
            <button
              onClick={requestManualReview}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-light"
            >
              <span className="material-icons-round">support_agent</span>
              Request Manual Review
            </button>
          ) : (
            <button
              onClick={requestManualReview}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
            >
              <span className="material-icons-round text-lg">upload_file</span>
              Re-upload Document
            </button>
          )}
        </div>
      </div>
    </StepWrapper>
  );
}
