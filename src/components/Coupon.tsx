import { QRCodeSVG } from 'qrcode.react';
import { Sparkles, Store } from 'lucide-react';
import { CONFIG } from '../data/config';
import type { UserId } from '../data/users';
import { couponCode, type Prize } from '../lib/prizes';
import { COLORS } from '../theme';
import { Chip } from './ui';

export function Coupon({ prize, userId, highlight = false }: { prize: Prize; userId: UserId; highlight?: boolean }) {
  const code = couponCode(userId, prize);
  return (
    <div className={`overflow-hidden rounded-2xl border bg-white ${highlight ? 'animate-pop border-disa-yellow shadow-card' : 'border-disa-line'}`}>
      <div className="flex">
        <div className="flex w-[84px] shrink-0 items-center justify-center bg-disa-yellow text-[38px]">{prize.emoji}</div>
        <div className="flex-1 p-3">
          <div className="flex flex-wrap items-center gap-1">
            <Chip tone="blue">Copilotos</Chip>
            {prize.partner && <Chip tone="yellow">Socio</Chip>}
          </div>
          <p className="mt-1 font-display text-[20px] font-semibold leading-tight">{prize.title}</p>
          <p className="text-[12px] text-disa-gray">{prize.source}</p>
        </div>
        <div className="flex items-center pr-3">
          <QRCodeSVG value={code} size={54} fgColor={COLORS.text} />
        </div>
      </div>
      {prize.why && (
        <p className="flex items-start gap-1.5 border-t border-disa-line bg-disa-bg px-3 py-2 text-[12px] text-disa-gray">
          <Sparkles size={13} className="mt-px shrink-0 text-disa-blue" />
          <span><b className="text-disa-blue">¿Por qué?</b> {prize.why}</span>
        </p>
      )}
      <p className="flex items-center gap-1.5 border-t border-dashed border-disa-line px-3 py-2 text-[11px] text-disa-gray">
        <Store size={12} /> {prize.footer ?? `Canjéalo al momento en la tienda · caduca en ${CONFIG.rewardExpiryDays} días`}
      </p>
    </div>
  );
}
