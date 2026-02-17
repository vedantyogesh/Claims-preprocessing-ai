import StepWrapper from "../layout/StepWrapper";
import { formatCurrency } from "../../utils/formatCurrency";

const FIELD_LABELS = {
  providerName: "Provider",
  invoiceDate: "Invoice Date",
  totalAmount: "Invoice Total",
  patientName: "Patient",
};

export default function SubmissionResult({ state }) {
  const { submission, routing, claim, extraction } = state;
  const { claimRef, manualReviewRequested, editLog } = submission;
  const { fields } = extraction;

  if (manualReviewRequested) {
    return (
      <StepWrapper>
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-9 w-9 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">Sent to Review Team</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your claim has been submitted for manual review by our team.
            </p>
          </div>

          {/* Claim ref */}
          <div className="w-full rounded-xl bg-blue-50 p-4">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Claim Reference</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{claimRef}</p>
          </div>

          <div className="w-full rounded-xl bg-gray-50 p-4 text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">What happens next</p>
            <p className="text-sm text-gray-600">
              A claims specialist will review your documents within <span className="font-semibold">5–7 business days</span> and contact you via email.
            </p>
          </div>
        </div>
      </StepWrapper>
    );
  }

  // Success
  const isFastTrack = routing.tier === "HIGH";

  return (
    <StepWrapper>
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-9 w-9 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">Claim Submitted!</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your OPD claim has been successfully received.
          </p>
        </div>

        {/* Claim ref + SLA */}
        <div className="w-full rounded-xl bg-green-50 p-4">
          <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Claim Reference</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{claimRef}</p>
          <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            isFastTrack ? "bg-green-200 text-green-800" : "bg-blue-100 text-blue-700"
          }`}>
            {isFastTrack ? (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
                Fast Track · {routing.sla}
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
                Standard · {routing.sla}
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full rounded-xl bg-gray-50 p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Claim Summary</p>
          <SummaryRow label="Service" value={claim.serviceType} />
          <SummaryRow label="Claimed Amount" value={formatCurrency(claim.amount)} />
          {fields.providerName.value && (
            <SummaryRow label="Provider" value={fields.providerName.value} />
          )}
          {fields.invoiceDate.value && (
            <SummaryRow label="Invoice Date" value={fields.invoiceDate.value} />
          )}
          {fields.patientName.value && (
            <SummaryRow label="Patient" value={fields.patientName.value} />
          )}
        </div>

        {/* Edit log */}
        {editLog.length > 0 && (
          <div className="w-full rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
              Manual Edits ({editLog.length})
            </p>
            <ul className="space-y-1">
              {editLog.map((entry, i) => (
                <li key={i} className="text-xs text-amber-600">
                  <span className="font-medium capitalize">{entry.field}</span>
                  {" → "}
                  <span className="font-semibold">{String(entry.newValue)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
