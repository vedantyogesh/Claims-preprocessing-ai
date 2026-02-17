import StepWrapper from "../layout/StepWrapper";
import { formatCurrency } from "../../utils/formatCurrency";

export default function SubmissionResult({ state, resetClaim }) {
  const { submission, routing, claim, extraction } = state;
  const { claimRef, manualReviewRequested, editLog } = submission;
  const { fields } = extraction;

  if (manualReviewRequested) {
    return (
      <StepWrapper>
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          {/* Hero Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-light">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
              <span className="material-icons-round text-3xl text-white">support_agent</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-primary">Sent to Review Team</h2>
            <p className="mt-2 text-sm text-text-secondary">
              Your claim has been submitted for manual review by our team.
            </p>
          </div>

          {/* Claim ref */}
          <div className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">Claim Reference</p>
            <p className="mt-1 font-mono text-2xl font-bold text-text-primary">{claimRef}</p>
          </div>

          {/* What's Next Timeline */}
          <div className="w-full rounded-2xl border border-gray-100 bg-surface-light p-5 text-left">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
              <span className="material-icons-round text-lg text-primary">timeline</span>
              What happens next
            </h3>

            <div className="relative space-y-4 pl-6">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-0.5 bg-gray-200" />

              {/* Step 1 */}
              <div className="relative flex gap-3">
                <div className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-teal">
                  <span className="material-icons-round text-xs text-white">check</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Claim Received</p>
                  <p className="text-xs text-text-secondary">Your claim is in our system</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex gap-3">
                <div className="absolute -left-6 h-4 w-4 animate-pulse rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Under Review</p>
                  <p className="text-xs text-text-secondary">A specialist is reviewing your documents</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex gap-3 opacity-50">
                <div className="absolute -left-6 h-4 w-4 rounded-full border-2 border-gray-300 bg-white" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Decision</p>
                  <p className="text-xs text-text-secondary">5–7 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <button
            onClick={resetClaim}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            <span className="material-icons-round">home</span>
            Back to Home
          </button>
        </div>
      </StepWrapper>
    );
  }

  // Success
  const isFastTrack = routing.tier === "HIGH";

  return (
    <StepWrapper>
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        {/* Hero Icon */}
        <div className={`flex h-20 w-20 items-center justify-center rounded-full ${
          isFastTrack ? "bg-mint-green" : "bg-primary-light"
        }`}>
          <div className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
            isFastTrack ? "bg-teal shadow-teal/40" : "bg-primary shadow-primary/30"
          }`}>
            <span className="material-icons-round text-3xl text-white">check</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-text-primary">Claim Submitted!</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Your OPD claim has been successfully received.
          </p>
        </div>

        {/* Claim ref + SLA */}
        <div className={`w-full rounded-2xl p-5 ${isFastTrack ? "bg-mint-green" : "bg-primary-light"}`}>
          <p className={`text-xs font-medium uppercase tracking-wider ${
            isFastTrack ? "text-teal" : "text-primary"
          }`}>Claim Reference</p>
          <p className={`mt-1 font-mono text-2xl font-bold ${
            isFastTrack ? "text-teal" : "text-primary"
          }`}>{claimRef}</p>

          <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isFastTrack
              ? "bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-800"
              : "bg-white/50 text-primary"
          }`}>
            <span className="material-icons-round text-sm">
              {isFastTrack ? "bolt" : "schedule"}
            </span>
            {isFastTrack ? `Fast Track · ${routing.sla}` : `Standard · ${routing.sla}`}
          </div>
        </div>

        {/* Summary */}
        <div className="w-full rounded-2xl border border-gray-100 bg-surface-light p-5 text-left">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
            <span className="material-icons-round text-lg text-text-secondary">receipt_long</span>
            Claim Summary
          </h3>

          <div className="space-y-3">
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
        </div>

        {/* What's Next Timeline */}
        <div className="w-full rounded-2xl border border-gray-100 bg-surface-light p-5 text-left">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
            <span className="material-icons-round text-lg text-primary">timeline</span>
            What happens next
          </h3>

          <div className="relative space-y-4 pl-6">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-0.5 bg-gray-200" />

            {/* Step 1 - Completed */}
            <div className="relative flex gap-3">
              <div className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-teal">
                <span className="material-icons-round text-xs text-white">check</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Claim Submitted</p>
                <p className="text-xs text-text-secondary">Your claim is in our system</p>
              </div>
            </div>

            {/* Step 2 - Active */}
            <div className="relative flex gap-3">
              <div className={`absolute -left-6 h-4 w-4 animate-pulse rounded-full ${
                isFastTrack ? "bg-teal" : "bg-primary"
              }`} />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {isFastTrack ? "AI Review" : "Under Review"}
                </p>
                <p className="text-xs text-text-secondary">
                  {isFastTrack ? "Automated verification in progress" : "A specialist is reviewing"}
                </p>
              </div>
            </div>

            {/* Step 3 - Pending */}
            <div className="relative flex gap-3 opacity-50">
              <div className="absolute -left-6 h-4 w-4 rounded-full border-2 border-gray-300 bg-white" />
              <div>
                <p className="text-sm font-medium text-text-primary">Reimbursement</p>
                <p className="text-xs text-text-secondary">
                  Expected in {routing.sla}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit log */}
        {editLog.length > 0 && (
          <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-800">
              <span className="material-icons-round text-lg">edit_note</span>
              Manual Edits ({editLog.length})
            </h3>
            <ul className="space-y-2">
              {editLog.map((entry, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize text-amber-700">{entry.field}</span>
                  <span className="font-semibold text-amber-900">{String(entry.newValue)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={resetClaim}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98]"
        >
          <span className="material-icons-round">home</span>
          Back to Home
        </button>
      </div>
    </StepWrapper>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}
