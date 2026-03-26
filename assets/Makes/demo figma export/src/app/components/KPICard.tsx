interface KPICardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function KPICard({ label, value, change, changeType = 'neutral' }: KPICardProps) {
  return (
    <div className="bg-[#FFFFFF] rounded-lg p-4">
      <div className="text-[#6E6A7A] text-xs mb-1">{label}</div>
      <div className="text-[#14131A] text-2xl tracking-tight mb-0.5">{value}</div>
      {change && (
        <div
          className={`text-xs ${
            changeType === 'positive'
              ? 'text-emerald-600'
              : changeType === 'negative'
              ? 'text-rose-600'
              : 'text-[#6E6A7A]'
          }`}
        >
          {change}
        </div>
      )}
    </div>
  );
}