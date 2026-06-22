export function ProBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
      Pro
    </span>
  );
}

export function LockedFeatureButton({
  icon,
  label,
  className = "",
}: {
  icon: string;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled
      title="Coming soon with Joobi Pro"
      className={`flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-400 ${className}`}
    >
      <span>{icon}</span>
      {label}
      <ProBadge />
    </button>
  );
}
