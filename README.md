# AI-Assisted OPD Claims Submission

A working prototype of an AI-assisted outpatient (OPD) claims submission flow for health insurance platforms. Demonstrates how validating invoices at the point of submission — rather than after — reduces claims entering a slow document verification loop.

---

## The Problem

A small percentage of OPD claims enter a document verification loop after submission. Once stuck, these claims take significantly longer to process than clean claims. Despite being a minority, they account for a disproportionate share of total processing delay.

The highest-leverage fix: prevent claims from entering the loop in the first place by catching invoice issues before submission — not after.

---

## What This Prototype Demonstrates

- **AI Invoice Extraction** — Gemini 1.5 Flash analyses the uploaded invoice and extracts structured fields: provider name, invoice date, total amount, line items, and patient name
- **Per-Field Confidence Scoring** — each extracted field is returned with a confidence score (0–1), surfaced to the member as a visual indicator
- **Deterministic Rule Validation** — checks for hard-block conditions: non-invoice documents, handwritten invoices, missing line items, unreadable documents
- **Confidence-Based SLA Routing** — average confidence determines whether the claim qualifies for Fast Track (24–48 hrs) or Standard review (3–5 business days)
- **Edit Logging** — any field the member edits is flagged and logged with the original value, new value, and timestamp — visible to the claims reviewer downstream
- **Manual Review Bypass** — always available; logs an override flag to the claims team so bypasses are never invisible
- **Draft Auto-Save** — blocked or incomplete submissions are preserved so members never lose progress

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| AI | Gemini 1.5 Flash (Vision API) |
| State | useReducer |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, StepWrapper
│   ├── steps/           # ClaimCreation, InvoiceUpload, FieldConfirmation, SubmissionResult
│   └── ui/              # ConfidencePill, EditableField, LineItemsTable, ValidationBanner, RoutingBanner
├── engine/
│   ├── gemini.js        # Gemini API call + response parsing
│   ├── validation.js    # Rule engine (pure function)
│   └── routing.js       # Confidence bucketing (pure function)
├── hooks/
│   └── useClaim.js      # Central state + all actions
├── utils/
│   ├── fileToBase64.js
│   ├── generateClaimRef.js
│   └── formatCurrency.js
└── constants/
    └── index.js
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com)

### Local Setup

```bash
git clone https://github.com/your-username/opd-claims-prototype.git
cd opd-claims-prototype
npm install
```

Create a `.env` file in the root:

```
VITE_GEMINI_API_KEY=your_key_here
```

Run the dev server:

```bash
npm run dev
```

---

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import the project in [vercel.com](https://vercel.com)
3. Add `VITE_GEMINI_API_KEY` under Project Settings → Environment Variables
4. Deploy — every push to `main` triggers an auto-deploy

---

## Claim Flow

```
Claim Creation → Invoice Upload → AI Extraction → Field Confirmation → Rule Validation → Confidence Routing → Submission
```

### Confidence Routing Logic

| Average Confidence | Tier | SLA |
|---|---|---|
| ≥ 0.8 | Fast Track | 24–48 hours |
| 0.5 – 0.79 | Standard | 3–5 business days |
| < 0.5 | Blocked | Manual review required |

### Hard Block Conditions

- Document is not an invoice
- Document is unreadable
- Handwritten invoice detected
- No itemised line items (lump-sum only)
- Total amount undetectable

---

## Design Decisions

- **Engine layer decoupled from UI** — `validation.js` and `routing.js` are pure functions with no React dependencies, making them independently testable and easy to extend
- **Low temperature on Gemini calls** — `temperature: 0.1` for deterministic, consistent extraction behavior
- **Manual review always accessible** — no member is ever permanently blocked due to AI limitations; all bypasses are logged
- **MVP scope: invoices only** — prescription validation (subjective, harder to automate deterministically) is intentionally out of scope for this phase

---

## License

MIT
