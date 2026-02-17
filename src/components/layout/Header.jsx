const STEPS = [
  { label: "Claim Details", num: 1 },
  { label: "Upload Documents", num: 2 },
  { label: "Review & Submit", num: 3 },
];

function stepToProgress(step) {
  if (step <= 1) return 1;
  if (step === 2) return 2;
  if (step >= 3) return 3;
}

export default function Header({ step, onBack }) {
  const progressStep = stepToProgress(step);
  const canGoBack = step > 1 && step < 5;
  const totalSteps = STEPS.length;
  const currentStepLabel = STEPS[progressStep - 1]?.label || "Done";

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-surface-light/80 backdrop-blur-md">
      <div className="mx-auto max-w-md px-4 py-4 md:max-w-2xl md:px-6">
        {/* Top row: Back button, Title, Close */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {canGoBack ? (
              <button
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Go back"
              >
                <span className="material-icons-round text-2xl">arrow_back</span>
              </button>
            ) : (
              <div className="h-10 w-10" />
            )}
            <h1 className="text-xl font-bold tracking-tight text-text-primary">
              {step === 5 ? "Claim Submitted" : "New Reimbursement"}
            </h1>
          </div>

          {step < 5 && (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-gray-100 hover:text-text-primary"
              aria-label="Close"
            >
              <span className="material-icons-round text-2xl">close</span>
            </button>
          )}
        </div>

        {/* Progress bar - only show if not on final step */}
        {step < 5 && (
          <div>
            {/* Progress pills */}
            <div className="mb-2 flex gap-2">
              {STEPS.map((s, i) => {
                const isCompleted = progressStep > s.num;
                const isActive = progressStep === s.num;

                return (
                  <div
                    key={s.num}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      isCompleted || isActive
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  />
                );
              })}
            </div>

            {/* Step label */}
            <p className="text-xs font-medium text-text-secondary">
              Step {progressStep} of {totalSteps}: {currentStepLabel}
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
