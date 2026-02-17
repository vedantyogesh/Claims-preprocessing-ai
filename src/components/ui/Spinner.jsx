export default function Spinner({ text = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary" />
      <p className="text-sm text-text-secondary">{text}</p>
    </div>
  );
}
