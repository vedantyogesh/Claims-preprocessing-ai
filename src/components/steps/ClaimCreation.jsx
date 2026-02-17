import { useState } from "react";
import StepWrapper from "../layout/StepWrapper";
import ApiKeyInput from "../ui/ApiKeyInput";
import { SERVICE_TYPES } from "../../constants";

const SERVICE_ICONS = {
  "Doctor Visit": "stethoscope",
  "Pharmacy": "medication",
  "Diagnostic / Lab": "biotech",
};

export default function ClaimCreation({ state, dispatch }) {
  const userApiKey = state?.ui?.userApiKey ?? "";
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
      {/* Info banner */}
      <div className="mb-6 rounded-xl border border-blue-100 bg-[#EBF5FF] p-4">
        <div className="flex items-start gap-3">
          <span className="material-icons-round text-primary">info</span>
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary">Quick tip</p>
            <p className="mt-0.5">Have your invoice ready. Clear, printed invoices qualify for Fast Track processing.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Type Cards */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-text-primary">
            What type of service? <span className="text-coral">*</span>
          </label>
          <div className="grid gap-3">
            {SERVICE_TYPES.map((type) => {
              const isSelected = serviceType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setServiceType(type)}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary-light"
                      : touched && !serviceType
                      ? "border-red-300 bg-coral-light"
                      : "border-gray-200 bg-surface-light hover:border-gray-300"
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    isSelected ? "bg-primary text-white" : "bg-gray-100 text-text-secondary"
                  }`}>
                    <span className="material-icons-round text-2xl">
                      {SERVICE_ICONS[type] || "medical_services"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isSelected ? "text-primary" : "text-text-primary"}`}>
                      {type}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {type === "Doctor Visit" && "Consultations & checkups"}
                      {type === "Pharmacy" && "Medicine purchases"}
                      {type === "Diagnostic / Lab" && "Lab tests & diagnostics"}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="material-icons-round text-primary">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
          {touched && !serviceType && (
            <p className="mt-2 flex items-center gap-1 text-xs text-coral">
              <span className="material-icons-round text-sm">error</span>
              Please select a service type
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">
            Claimed Amount <span className="text-coral">*</span>
          </label>
          <div className={`flex items-center rounded-xl border-2 bg-surface-light px-4 py-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${
            touched && (!amount || Number(amount) <= 0)
              ? "border-red-300 bg-coral-light"
              : "border-gray-200"
          }`}>
            <span className="text-lg font-bold text-text-secondary">₹</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="ml-2 flex-1 bg-transparent text-2xl font-bold text-text-primary outline-none placeholder:text-gray-300"
            />
          </div>
          {touched && (!amount || Number(amount) <= 0) && (
            <p className="mt-2 flex items-center gap-1 text-xs text-coral">
              <span className="material-icons-round text-sm">error</span>
              Please enter a valid amount
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid && touched}
          className={`w-full rounded-xl py-4 text-base font-bold transition-all active:scale-[0.98] ${
            isValid
              ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover"
              : "bg-gray-200 text-text-secondary"
          }`}
        >
          Continue to Upload
          <span className="material-icons-round ml-2 align-middle text-xl">arrow_forward</span>
        </button>

        {/* BYOK — placed below the primary CTA so it doesn't distract */}
        <ApiKeyInput userApiKey={userApiKey} dispatch={dispatch} />
      </form>
    </StepWrapper>
  );
}
