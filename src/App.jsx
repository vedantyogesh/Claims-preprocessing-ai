import { useClaim } from "./hooks/useClaim";
import Header from "./components/layout/Header";
import ClaimCreation from "./components/steps/ClaimCreation";
import InvoiceUpload from "./components/steps/InvoiceUpload";
import FieldConfirmation from "./components/steps/FieldConfirmation";
import SubmissionResult from "./components/steps/SubmissionResult";

export default function App() {
  const claim = useClaim();
  const { step } = claim.state;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header step={step} onBack={claim.goBack} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        {step === 1 && <ClaimCreation {...claim} />}
        {step === 2 && <InvoiceUpload {...claim} />}
        {(step === 3 || step === 4) && <FieldConfirmation {...claim} />}
        {step === 5 && <SubmissionResult {...claim} />}
      </main>
    </div>
  );
}
