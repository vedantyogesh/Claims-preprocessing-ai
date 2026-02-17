export default function StepWrapper({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
