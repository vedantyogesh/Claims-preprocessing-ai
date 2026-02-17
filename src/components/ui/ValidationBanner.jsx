export default function ValidationBanner({ errors, warnings }) {
  if (!errors?.length && !warnings?.length) return null;

  return (
    <div className="space-y-2">
      {errors?.map((error, i) => (
        <div key={i} className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <span className="mt-0.5 text-red-500">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ))}
      {warnings?.map((warning, i) => (
        <div key={i} className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <span className="mt-0.5 text-amber-500">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="text-sm text-amber-700">{warning}</p>
        </div>
      ))}
    </div>
  );
}
