import ConfidencePill from "./ConfidencePill";

export default function EditableField({ label, fieldKey, fieldData, onEdit }) {
  const { value, confidence, edited } = fieldData;

  // Don't render editable field for lineItems — handled separately
  if (fieldKey === "lineItems") return null;

  const displayValue = value !== null && value !== undefined ? String(value) : "";

  return (
    <div className={`relative rounded-xl border p-4 transition-all ${
      edited
        ? "border-amber-400 bg-amber-50"
        : "border-gray-200 bg-surface-light hover:border-gray-300"
    }`}>
      {/* Floating label */}
      <label className="absolute -top-2.5 left-3 bg-surface-light px-1 text-xs font-medium text-text-secondary">
        {label}
      </label>

      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => onEdit(fieldKey, e.target.value)}
          placeholder="Not detected"
          className={`flex-1 bg-transparent text-base font-medium text-text-primary outline-none placeholder:italic placeholder:text-gray-400 ${
            !value ? "italic text-gray-400" : ""
          }`}
        />

        <div className="flex items-center gap-2">
          {edited && (
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
              Edited
            </span>
          )}
          <ConfidencePill confidence={confidence} />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary-light"
            aria-label="Edit field"
          >
            <span className="material-icons-round text-xl">edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
