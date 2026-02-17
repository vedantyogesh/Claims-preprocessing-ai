import ConfidencePill from "./ConfidencePill";

export default function EditableField({ label, fieldKey, fieldData, onEdit }) {
  const { value, confidence, edited } = fieldData;

  // Don't render editable field for lineItems — handled separately
  if (fieldKey === "lineItems") return null;

  const displayValue = value !== null && value !== undefined ? String(value) : "";

  return (
    <div className={`rounded-lg border p-3 transition-colors ${edited ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white"}`}>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          {edited && (
            <span className="rounded bg-amber-200 px-1.5 py-0.5 text-xs font-medium text-amber-800">
              Edited
            </span>
          )}
          <ConfidencePill confidence={confidence} />
        </div>
      </div>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => onEdit(fieldKey, e.target.value)}
        placeholder="Not detected"
        className={`w-full rounded border bg-transparent px-2 py-1 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-300 ${
          edited ? "border-amber-300" : "border-gray-200"
        } ${!value ? "italic text-gray-400" : ""}`}
      />
    </div>
  );
}
