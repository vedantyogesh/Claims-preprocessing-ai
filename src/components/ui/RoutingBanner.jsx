export default function RoutingBanner({ routing }) {
  if (!routing?.tier || routing.tier === "LOW") return null;

  if (routing.tier === "HIGH") {
    return (
      <div className="flex items-start gap-4 rounded-xl border border-teal/30 bg-mint-green p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal shadow-teal-glow">
          <span className="material-icons-round text-xl text-white">bolt</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-teal">Fast Track</p>
            <span className="rounded-full bg-teal/20 px-2 py-0.5 text-xs font-semibold text-teal">
              Auto Approved
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            High confidence extraction ({Math.round(routing.averageConfidence * 100)}%).
            Expected processing: <span className="font-semibold">{routing.sla}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary-light p-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary shadow-primary-glow">
        <span className="material-icons-round text-xl text-white">schedule</span>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-primary">Standard Review</p>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            Requires Verification
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Moderate confidence ({Math.round(routing.averageConfidence * 100)}%).
          A reviewer will verify your claim. Expected: <span className="font-semibold">{routing.sla}</span>
        </p>
      </div>
    </div>
  );
}
