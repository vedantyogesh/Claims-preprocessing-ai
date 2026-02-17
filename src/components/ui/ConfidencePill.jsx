export default function ConfidencePill({ confidence }) {
  if (confidence >= 0.8) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-teal-light px-2.5 py-0.5 text-xs font-medium text-teal">
        <span className="material-icons-round text-sm">check_circle</span>
        High
      </span>
    );
  }
  if (confidence >= 0.5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <span className="material-icons-round text-sm">warning</span>
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-coral-light px-2.5 py-0.5 text-xs font-medium text-coral">
      <span className="material-icons-round text-sm">error</span>
      Low
    </span>
  );
}
