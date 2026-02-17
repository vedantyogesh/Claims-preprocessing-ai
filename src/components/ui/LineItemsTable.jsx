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
    <div className={`rounded-lg border p-3 transition-colors ${edited ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white"}`}>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Line Items
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

      {!hasItems ? (
        <p className="py-3 text-center text-sm italic text-gray-400">
          No line items detected
        </p>
      ) : (
        <div className="overflow-hidden rounded border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Description</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="px-2 py-1.5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleDescriptionChange(i, e.target.value)}
                      className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-sm text-gray-800 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
                    />
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleAmountChange(i, e.target.value)}
                      className="w-24 rounded border border-transparent bg-transparent px-1 py-0.5 text-right text-sm text-gray-800 outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-3 py-2 text-xs font-semibold text-gray-600">Total</td>
                <td className="px-3 py-2 text-right text-xs font-semibold text-gray-800">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
