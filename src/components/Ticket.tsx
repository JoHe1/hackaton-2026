import { CONFIG } from '../data/config';
import type { TicketBreakdown } from '../lib/pricing';
import { formatEur, formatInt, formatPricePerLiter } from '../lib/format';
import type { SavingsChoice } from '../store/demoStore';

interface Props {
  breakdown: TicketBreakdown;
  product: string;
  stationName: string;
  choice: SavingsChoice | null;
  compact?: boolean;
}

/** Fuel ticket. With "points" the discount is not taken off: it becomes points. */
export function Ticket({ breakdown, product, stationName, choice, compact = false }: Props) {
  const showPoints = choice === 'points';
  const totalPaid = showPoints ? breakdown.gross : breakdown.total;
  return (
    <div className={`rounded-xl bg-white font-mono text-[13px] text-disa-ink ${compact ? 'p-3' : 'border border-dashed border-disa-gray/40 p-4'}`}>
      {!compact && (
        <p className="mb-2 text-center text-[12px] uppercase tracking-widest text-disa-gray">{stationName}</p>
      )}
      <div className="flex justify-between">
        <span>{product} {breakdown.liters} L</span>
        <span>{formatEur(breakdown.gross)}</span>
      </div>
      <p className="text-[11px] text-disa-gray">{breakdown.liters} L × {formatPricePerLiter(breakdown.pricePerLiter)}</p>
      {breakdown.passApplies && (
        <div className={`mt-1.5 flex justify-between ${showPoints ? 'text-disa-gray line-through' : 'text-disa-green'}`}>
          <span>Pase copilotos ({breakdown.copilots} × {CONFIG.centsPerLiterPerCopilot} c/L)</span>
          <span>−{formatEur(breakdown.discount)}</span>
        </div>
      )}
      <div className="my-2 border-t border-dashed border-disa-gray/40" />
      <div className="flex justify-between text-[16px] font-bold">
        <span>TOTAL</span>
        <span>{formatEur(totalPaid)}</span>
      </div>
      {showPoints && (
        <p className="mt-1 text-right font-bold text-disa-blue">+{formatInt(breakdown.pointsIfAccumulate)} puntos</p>
      )}
    </div>
  );
}
