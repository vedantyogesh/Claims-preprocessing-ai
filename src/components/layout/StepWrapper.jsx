export default function StepWrapper({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-surface-light p-5 shadow-soft md:p-6">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl font-bold text-text-primary">{title}</h2>}
          {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
