import { useReducer, useRef } from "react";
import { extractInvoiceData } from "../engine/gemini";
import { runValidation } from "../engine/validation";
import { routeClaim } from "../engine/routing";
import { checkRateLimit, recordCall } from "../utils/rateLimiter";
import { generateClaimRef } from "../utils/generateClaimRef";

const initialState = {
  step: 1, // 1–5
  claim: {
    serviceType: "",
    amount: null,
    uploadedFile: null,
    filePreview: null,
  },
  extraction: {
    documentType: null,
    isHandwritten: false,
    fields: {
      providerName: { value: null, confidence: 0, edited: false },
      invoiceDate:  { value: null, confidence: 0, edited: false },
      totalAmount:  { value: null, confidence: 0, edited: false },
      lineItems:    { value: [],   confidence: 0, edited: false },
      patientName:  { value: null, confidence: 0, edited: false },
    },
    overallNotes: "",
  },
  validation: {
    passed: false,
    errors: [],
    warnings: [],
    attemptCount: 0,
  },
  routing: {
    tier: null,
    averageConfidence: null,
    sla: null,
  },
  submission: {
    claimRef: null,
    manualReviewRequested: false,
    editLog: [],
  },
  ui: {
    isLoading: false,
    error: null,
    userApiKey: "",
  },
};

function claimReducer(state, action) {
  switch (action.type) {
    case "SET_CLAIM_DETAILS":
      return { ...state, claim: { ...state.claim, ...action.payload }, step: 2 };

    case "SET_FILE":
      return {
        ...state,
        claim: { ...state.claim, uploadedFile: action.file, filePreview: action.preview },
      };

    case "SET_EXTRACTION":
      return {
        ...state,
        extraction: {
          ...action.payload,
          fields: {
            ...action.payload.fields,
            providerName: { ...action.payload.fields.providerName, edited: false },
            invoiceDate:  { ...action.payload.fields.invoiceDate,  edited: false },
            totalAmount:  { ...action.payload.fields.totalAmount,  edited: false },
            lineItems:    { ...action.payload.fields.lineItems,    edited: false },
            patientName:  { ...action.payload.fields.patientName,  edited: false },
          },
        },
        ui: { ...state.ui, isLoading: false },
      };

    case "SET_LOADING":
      return { ...state, ui: { ...state.ui, isLoading: action.value, error: null } };

    case "SET_ERROR":
      return { ...state, ui: { ...state.ui, isLoading: false, error: action.message } };

    case "SET_USER_API_KEY":
      return { ...state, ui: { ...state.ui, userApiKey: action.key } };

    case "EDIT_FIELD":
      return {
        ...state,
        extraction: {
          ...state.extraction,
          fields: {
            ...state.extraction.fields,
            [action.field]: {
              ...state.extraction.fields[action.field],
              value: action.value,
              edited: true,
            },
          },
        },
        submission: {
          ...state.submission,
          editLog: [
            ...state.submission.editLog,
            {
              field: action.field,
              originalValue: action.originalValue,
              newValue: action.value,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      };

    case "SET_VALIDATION":
      return {
        ...state,
        validation: { ...action.payload, attemptCount: state.validation.attemptCount + 1 },
      };

    case "SET_ROUTING":
      return { ...state, routing: action.payload };

    case "ADVANCE_STEP":
      return { ...state, step: state.step + 1 };

    case "REQUEST_MANUAL_REVIEW":
      return {
        ...state,
        submission: {
          ...state.submission,
          manualReviewRequested: true,
          claimRef: generateClaimRef(),
        },
        step: 5,
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        submission: { ...state.submission, claimRef: generateClaimRef() },
        step: 5,
      };

    case "GO_BACK": {
      // Step 4 (post-validation) goes back to step 3 (review), not step 2
      const prevStep = state.step === 4 ? 3 : Math.max(1, state.step - 1);
      // Reset validation when going back from review
      const resetValidation = state.step >= 3
        ? { passed: false, errors: [], warnings: [], attemptCount: 0 }
        : state.validation;
      // Reset routing when going back from review
      const resetRouting = state.step >= 3
        ? { tier: null, averageConfidence: null, sla: null }
        : state.routing;
      return {
        ...state,
        step: prevStep,
        validation: resetValidation,
        routing: resetRouting,
        ui: { ...state.ui, error: null },
      };
    }

    default:
      return state;
  }
}

export function useClaim() {
  const [state, dispatch] = useReducer(claimReducer, initialState);
  const abortControllerRef = useRef(null);

  async function analyseInvoice(file) {
    // Rate limit check (bypassed in dev mode automatically)
    const { allowed, reason } = checkRateLimit();
    if (!allowed) {
      dispatch({ type: "SET_ERROR", message: reason });
      return;
    }

    // Cancel any in-flight request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Record call before the await so concurrent triggers are also blocked
    recordCall();
    dispatch({ type: "SET_LOADING", value: true });

    try {
      const result = await extractInvoiceData(
        file,
        abortControllerRef.current.signal,
        state.ui.userApiKey
      );
      dispatch({ type: "SET_EXTRACTION", payload: result });
      dispatch({ type: "ADVANCE_STEP" });
    } catch (err) {
      if (err.name === "AbortError") return; // silently swallow cancelled requests
      dispatch({ type: "SET_ERROR", message: err.message });
    }
  }

  function submitClaim() {
    const validationResult = runValidation(state.extraction, state.claim);
    dispatch({ type: "SET_VALIDATION", payload: validationResult });

    if (!validationResult.passed) return;

    const routingResult = routeClaim(state.extraction.fields);
    dispatch({ type: "SET_ROUTING", payload: routingResult });

    if (routingResult.tier === "LOW") return; // Blocked — surface manual review

    dispatch({ type: "SUBMIT_SUCCESS" });
  }

  function editField(field, value) {
    const originalValue = state.extraction.fields[field].value;
    dispatch({ type: "EDIT_FIELD", field, value, originalValue });
  }

  function requestManualReview() {
    dispatch({ type: "REQUEST_MANUAL_REVIEW" });
  }

  function goBack() {
    dispatch({ type: "GO_BACK" });
  }

  return { state, analyseInvoice, submitClaim, editField, requestManualReview, goBack, dispatch };
}
