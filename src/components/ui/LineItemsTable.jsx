import ConfidencePill from "./ConfidencePill";
import { formatCurrency } from "../../utils/formatCurrency";

export default function LineItemsTable({ lineItemsField, onEdit }) {
  const { value: items, confidence, edited } = lineItemsField;

  const hasItems = items && items.length > 0;

  function handleDescriptionChange(index, newDesc) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, description: newDesc } : item
    );
    onEdit("lineItems", updated);
  }

  function handleAmountChange(index, newAmount) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, amount: parseFloat(newAmount) || 0 } : item
    );
    onEdit("lineItems", updated);
  }

  const total = hasItems ? items.reduce((sum, item) => sum + (item.amount || 0), 0) : 0;

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      edited
        ? "border-amber-400 bg-amber-50"
        : "border-gray-200 bg-surface-light"
    }`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-icons-round text-lg text-text-secondary">receipt_long</span>
          <label className="text-sm font-semibold text-text-primary">
            Line Items
          </label>
        </div>
        <div className="flex items-center gap-2">
          {edited && (
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800">
              Edited
            </span>
          )}
          <ConfidencePill confidence={confidence} />
        </div>
      </div>

      {!hasItems ? (
        <p className="py-4 text-center text-sm italic text-text-secondary">
          No line items detected
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white p-3"
            >
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleDescriptionChange(i, e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium text-text-primary outline-none focus:ring-0"
                placeholder="Description"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm text-text-secondary">₹</span>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleAmountChange(i, e.target.value)}
                  className="w-20 bg-transparent text-right text-sm font-semibold text-text-primary outline-none focus:ring-0"
                />
              </div>
            </div>
          ))}

          {/* Total row */}
          <div className="flex items-center justify-between border-t border-dashed border-gray-300 pt-3">
            <span className="text-sm font-semibold text-text-secondary">Total</span>
            <span className="text-lg font-bold text-text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
