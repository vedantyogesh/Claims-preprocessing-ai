export default function ValidationBanner({ errors, warnings }) {
  if (!errors?.length && !warnings?.length) return null;

  return (
    <div className="space-y-3">
      {errors?.map((error, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-red-200 bg-coral-light p-4">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-coral text-white">
            <span className="material-icons-round text-base">close</span>
          </span>
          <div>
            <p className="text-sm font-semibold text-deep-red">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      ))}
      {warnings?.map((warning, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-white">
            <span className="material-icons-round text-base">warning</span>
          </span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Warning</p>
            <p className="text-sm text-amber-700">{warning}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
