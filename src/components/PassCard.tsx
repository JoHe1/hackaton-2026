import { Clock } from 'lucide-react';
import { CONFIG } from '../data/config';
import { getUser, type UserId } from '../data/users';
import { SECURITY_MESSAGES } from '../data/security';
import { formatCountdown } from '../lib/format';
import { discountCentsPerLiter } from '../lib/pricing';
import { Avatar } from './Avatar';

interface Props {
  driverId: UserId;
  copilots: UserId[];
  remainingSeconds: number;
  consumed?: boolean;
}

/** "3 copilotos · 30:00 · −6 c/L" pass with live countdown. */
export function PassCard({ driverId, copilots, remainingSeconds, consumed = false }: Props) {
  const expired = !consumed && remainingSeconds <= 0;
  const inactive = expired || consumed;
  const cents = discountCentsPerLiter(copilots.length);
  const driver = getUser(driverId);
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-card transition ${
        inactive ? 'bg-[#9AA5B1] grayscale' : 'bg-disa-blue'
      }`}
    >
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-disa-yellow" />
      <div className="flex items-center justify-between">
        <span className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-white/80">
          Pase de copilotos
        </span>
        {expired && (
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[12px] font-bold uppercase text-disa-gray">
            {SECURITY_MESSAGES.expired}
          </span>
        )}
        {consumed && <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[12px] font-bold text-disa-green">Usado</span>}
      </div>
      <p className="mt-2 font-display text-[26px] font-semibold leading-tight">
        {copilots.length} copilotos · <span className="tabular-nums">{formatCountdown(remainingSeconds)}</span> ·{' '}
        <span className={inactive ? '' : 'text-disa-yellow'}>−{cents} c/L</span>
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Avatar userId={driverId} size={36} />
        <span className="text-white/60">+</span>
        {copilots.map((id) => (
          <Avatar key={id} userId={id} size={36} checked={!inactive} />
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[13px] text-white/85">
        <Clock size={14} />
        {inactive
          ? `${driver.car} · pase no disponible`
          : `Válido ${CONFIG.passMinutes} min · paga con tu tarjeta DISA y se aplica solo`}
      </p>
    </div>
  );
}
