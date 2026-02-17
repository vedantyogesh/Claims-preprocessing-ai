import StepWrapper from "../layout/StepWrapper";
import EditableField from "../ui/EditableField";
import LineItemsTable from "../ui/LineItemsTable";
import ValidationBanner from "../ui/ValidationBanner";
import RoutingBanner from "../ui/RoutingBanner";

const FIELD_LABELS = {
  providerName: "Provider / Hospital Name",
  invoiceDate: "Invoice Date",
  totalAmount: "Total Amount (₹)",
  patientName: "Patient Name",
};

export default function FieldConfirmation({ state, submitClaim, editField, requestManualReview }) {
  const { extraction, validation, routing } = state;
  const { fields } = extraction;

  const hasValidationAttempt = validation.attemptCount > 0;
  const isBlocked = hasValidationAttempt && !validation.passed;
  const isValidationPassed = hasValidationAttempt && validation.passed;
  const isLowConfidence = isValidationPassed && routing.tier === "LOW";
  const showManualReviewButton = isBlocked && validation.attemptCount >= 2;

  return (
    <StepWrapper
      title="Review Extracted Fields"
      description="Verify the details extracted from your invoice. Edit any incorrect fields before submitting."
    >
      <div className="space-y-4">
        {/* Document type notice */}
        {extraction.documentType && (
          <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
            Document type: <span className="font-semibold text-gray-700 capitalize">{extraction.documentType}</span>
            {extraction.isHandwritten && (
              <span className="ml-2 text-red-500 font-medium">· Handwritten</span>
            )}
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

        {/* Overall notes from Gemini */}
        {extraction.overallNotes && (
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500 mb-1">AI Notes</p>
            <p className="text-sm text-blue-700">{extraction.overallNotes}</p>
          </div>
        )}

        {/* Validation errors/warnings — only shown after attempt */}
        {hasValidationAttempt && (
          <ValidationBanner errors={validation.errors} warnings={validation.warnings} />
        )}

        {/* Routing banner — shown after successful validation */}
        {isValidationPassed && !isLowConfidence && (
          <RoutingBanner routing={routing} />
        )}

        {/* Low confidence blocked routing */}
        {isLowConfidence && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-semibold text-orange-800">Manual Review Required</p>
            <p className="text-xs text-orange-600 mt-1">
              Confidence score too low for automated processing ({Math.round(routing.averageConfidence * 100)}%). Please request manual review.
            </p>
          </div>
        )}

        {/* Submit button */}
        {!isLowConfidence && (
          <button
            onClick={submitClaim}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1"
          >
            {isValidationPassed ? "Confirm & Submit Claim" : "Submit Claim"}
          </button>
        )}

        {/* Manual review — always available after failures or on low confidence */}
        {(showManualReviewButton || isLowConfidence) ? (
          <button
            onClick={requestManualReview}
            className="w-full rounded-lg border border-indigo-300 bg-white py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus:outline-none"
          >
            Request Manual Review
          </button>
        ) : (
          <p className="text-center">
            <button
              onClick={requestManualReview}
              className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
            >
              Request manual review instead
            </button>
          </p>
        )}
      </div>
    </StepWrapper>
  );
}
