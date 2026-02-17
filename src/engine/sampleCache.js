// Exact responses captured from Gemini API — do not edit manually.
// If sample images in /public/samples/ are replaced, re-run the
// capture script to update these fixtures.

const CACHE = {
  "sample-success.jpg": {
    documentType: "receipt",
    isHandwritten: false,
    fields: {
      providerName: { value: "New Life Hospital", confidence: 0.95 },
      invoiceDate:  { value: "2022-12-02",        confidence: 0.95 },
      totalAmount:  { value: 500,                 confidence: 0.95 },
      lineItems:    {
        value: [{ description: "Consultation Fee", amount: 500 }],
        confidence: 0.95,
      },
      patientName:  { value: "Mr. KARAN",         confidence: 0.95 },
    },
    overallNotes: "Received with thanks Rs. 500/- from Mr. KARAN.",
  },

  "sample-failure.jpg": {
    documentType: "prescription",
    isHandwritten: false,
    fields: {
      providerName: { value: "Leslie Holden", confidence: 0.9 },
      invoiceDate:  { value: "2021-11-08",    confidence: 0.9 },
      totalAmount:  { value: null,            confidence: 0   },
      lineItems:    { value: null,            confidence: 0   },
      patientName:  { value: "Anne Burton",   confidence: 0.9 },
    },
    overallNotes: null,
  },
};

/**
 * Returns the cached Gemini extraction result for a known sample file,
 * or null for any other filename (real user uploads go through Gemini).
 */
export function getSampleCache(filename) {
  return CACHE[filename] ?? null;
}
