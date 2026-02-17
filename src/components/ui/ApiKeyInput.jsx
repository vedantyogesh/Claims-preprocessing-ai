import { useState } from "react";

export default function ApiKeyInput({ userApiKey, dispatch }) {
  const [expanded, setExpanded] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const hasKey = userApiKey && userApiKey.trim().length > 0;

  function handleChange(e) {
    dispatch({ type: "SET_USER_API_KEY", key: e.target.value });
  }

  function handleClear() {
    dispatch({ type: "SET_USER_API_KEY", key: "" });
    setShowKey(false);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 7a5 5 0 0 1 9.192 1.667A5.5 5.5 0 0 1 10.5 19h-5A5.5 5.5 0 0 1 1 13.5a5.5 5.5 0 0 1 4.5-5.415V7a2.5 2.5 0 0 1 2.5-2.5Zm-.5 8.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-600">Use your own Gemini API key</span>
          {hasKey && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Active
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3">
          <p className="mb-3 text-xs text-gray-500">
            Your key is used only for this session and is never stored or logged. It bypasses the shared quota so you can analyse without limits.
          </p>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={userApiKey}
              onChange={handleChange}
              placeholder="AIzaSy..."
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-20 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="rounded p-1 text-gray-400 hover:text-gray-600"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                    <path d="M10.748 13.93l2.523 2.524a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              {/* Clear */}
              {hasKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded p-1 text-gray-400 hover:text-red-500"
                  aria-label="Clear key"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Get a key at{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 underline underline-offset-2"
            >
              aistudio.google.com/apikey
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
