import { useState } from "react";
import StepWrapper from "../layout/StepWrapper";
import { SERVICE_TYPES } from "../../constants";

export default function ClaimCreation({ dispatch }) {
  const [serviceType, setServiceType] = useState("");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!serviceType || !amount || Number(amount) <= 0) return;
    dispatch({
      type: "SET_CLAIM_DETAILS",
      payload: { serviceType, amount: Number(amount) },
    });
  }

  const isValid = serviceType && amount && Number(amount) > 0;

  return (
    <StepWrapper
      title="New OPD Claim"
      description="Tell us about your medical expense before uploading the invoice."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Service Type */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
              touched && !serviceType ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
            }`}
          >
            <option value="">Select a service type…</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {touched && !serviceType && (
            <p className="mt-1 text-xs text-red-500">Please select a service type</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Claimed Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
              ₹
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={`w-full rounded-lg border py-2.5 pl-7 pr-3 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-300 ${
                touched && (!amount || Number(amount) <= 0)
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            />
          </div>
          {touched && (!amount || Number(amount) <= 0) && (
            <p className="mt-1 text-xs text-red-500">Please enter a valid amount</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:opacity-50"
        >
          Continue to Upload
        </button>
      </form>
    </StepWrapper>
  );
}
