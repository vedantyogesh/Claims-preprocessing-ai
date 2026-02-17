export default function RoutingBanner({ routing }) {
  if (!routing?.tier || routing.tier === "LOW") return null;

  if (routing.tier === "HIGH") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <span className="text-green-500">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-green-800">Fast Track — Auto Approved</p>
          <p className="text-xs text-green-600 mt-0.5">
            High confidence extraction ({Math.round(routing.averageConfidence * 100)}%). Expected processing: {routing.sla}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <span className="text-blue-500">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-blue-800">Standard Review</p>
        <p className="text-xs text-blue-600 mt-0.5">
          Moderate confidence ({Math.round(routing.averageConfidence * 100)}%). A reviewer will verify your claim. Expected processing: {routing.sla}
        </p>
      </div>
    </div>
  );
}
