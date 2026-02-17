const STEPS = [
  { label: "Create", num: 1 },
  { label: "Upload", num: 2 },
  { label: "Review", num: 3 },
  { label: "Done",   num: 5 },
];

function stepToProgress(step) {
  if (step <= 1) return 1;
  if (step === 2) return 2;
  if (step === 3 || step === 4) return 3;
  return 4;
}

export default function Header({ step, onBack }) {
  const progressStep = stepToProgress(step);
  const canGoBack = step > 1 && step < 5;

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-2xl px-4 py-4">
        {/* Wordmark row */}
        <div className="mb-5 flex items-center gap-2">
          {canGoBack && (
            <button
              onClick={onBack}
              className="mr-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="Go back"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5V15a3 3 0 106 0V3.5A1.5 1.5 0 006.5 2h-3zm11.753 6.99L9.5 14.743V6.25l5.753 2.74zM10 3.5a.75.75 0 01.75-.75H17a.75.75 0 010 1.5h-6.25A.75.75 0 0110 3.5zm.75 2.75a.75.75 0 000 1.5H17a.75.75 0 000-1.5h-6.25z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-lg font-bold text-indigo-700 tracking-tight">Even Health</span>
          <span className="ml-1 text-sm text-gray-400 font-medium">OPD Claims</span>
        </div>

        {/* Progress steps */}
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const isCompleted = progressStep > s.num || (s.num === 4 && progressStep === 4);
            const isActive = progressStep === s.num || (s.num === 3 && (progressStep === 3)) || (s.num === 4 && progressStep === 4);
            const isLast = i === STEPS.length - 1;

            // Map display step num for comparison
            const stepNum = s.num === 5 ? 4 : s.num;
            const activeStepNum = progressStep === 5 ? 4 : progressStep;
            const completedStep = activeStepNum > stepNum;
            const activeStep = activeStepNum === stepNum;

            return (
              <div key={s.num} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      completedStep
                        ? "bg-indigo-600 text-white"
                        : activeStep
                        ? "border-2 border-indigo-600 bg-white text-indigo-600"
                        : "border-2 border-gray-200 bg-white text-gray-400"
                    }`}
                  >
                    {completedStep ? (
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium ${
                      completedStep || activeStep ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`mx-1 mb-4 h-0.5 flex-1 transition-colors ${
                      completedStep ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
