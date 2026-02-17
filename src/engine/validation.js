export function runValidation(extraction, claim) {
  const errors = [];
  const warnings = [];

  const { documentType, isHandwritten, fields } = extraction;

  // ── Hard Blocks ──────────────────────────────────────────────
  if (documentType === "unreadable") {
    errors.push("Document is unreadable. Please upload a clearer image.");
  }

  if (documentType !== "invoice" && documentType !== "receipt" && documentType !== "unreadable") {
    errors.push(
      `This appears to be a ${documentType}, not an invoice. Please upload a valid printed invoice.`
    );
  }

  if (isHandwritten) {
    errors.push("Handwritten invoices are not accepted. Please upload a printed invoice.");
  }

  if (!fields.lineItems.value || fields.lineItems.value.length === 0) {
    errors.push("Invoice must contain itemised line items. Lump-sum invoices are not accepted.");
  }

  if (fields.totalAmount.value === null) {
    errors.push("Total amount could not be determined from this document.");
  }

  // ── Soft Warnings ─────────────────────────────────────────────
  if (fields.invoiceDate.value) {
    const invoiceDate = new Date(fields.invoiceDate.value);
    const today = new Date();
    const diffDays = Math.abs((today - invoiceDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      warnings.push("Invoice date is more than 30 days old. This may require additional review.");
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}
