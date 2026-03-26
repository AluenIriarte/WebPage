import { AlertCircle } from 'lucide-react';

interface AlertBannerProps {
  message: string;
  type?: 'warning' | 'info' | 'opportunity';
}

export function AlertBanner({ message, type = 'info' }: AlertBannerProps) {
  const colors = {
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    opportunity: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  };

  return (
    <div className={`rounded-lg p-4 border ${colors[type]} flex items-start gap-3`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
