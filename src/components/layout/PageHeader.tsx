export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-bark/15 pb-5">
      <div>
        <h1 className="text-2xl font-bold text-forest">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-bark/80">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
