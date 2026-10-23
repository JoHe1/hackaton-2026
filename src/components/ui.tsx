import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-disa-line bg-white p-4 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-display text-[19px] font-medium text-disa-blue">{children}</h3>
      {aside}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled = false, tone = 'blue', className = '' }: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: 'blue' | 'yellow' | 'outline';
  className?: string;
}) {
  const tones = {
    blue: 'bg-disa-blue text-white',
    yellow: 'bg-disa-yellow text-disa-ink',
    outline: 'border-2 border-disa-blue bg-white text-disa-blue',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full px-5 py-3 font-display text-[17px] font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({ children, tone = 'yellow' }: { children: ReactNode; tone?: 'yellow' | 'green' | 'gray' | 'blue' | 'red' }) {
  const tones = {
    yellow: 'bg-disa-yellow text-disa-ink',
    green: 'bg-[#E3F3EA] text-disa-green',
    gray: 'bg-disa-bg text-disa-gray',
    blue: 'bg-[#E6EEF8] text-disa-blue',
    red: 'bg-[#FDECEC] text-disa-red',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, max, tone = 'yellow' }: { value: number; max: number; tone?: 'yellow' | 'green' | 'blue' }) {
  const colors = { yellow: 'bg-disa-yellow', green: 'bg-disa-green', blue: 'bg-disa-blue' };
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-disa-line">
      <div className={`h-full rounded-full transition-all duration-700 ${colors[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
