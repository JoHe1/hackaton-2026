import { Gift } from 'lucide-react';
import { Coupon } from '../../components/Coupon';
import { StatusBar } from '../../components/StatusBar';
import { formatInt } from '../../lib/format';
import { prizesFor } from '../../lib/prizes';
import { computeTicket } from '../../lib/pricing';
import { DEMO_TICKET } from '../../data/ticket';
import { DRIVER_ID, type UserId } from '../../data/users';
import { useDemoStore } from '../../store/demoStore';

export function OffersScreen({ userId }: { userId: UserId }) {
  const state = useDemoStore();
  const prizes = prizesFor(state, userId);
  const points =
    userId === DRIVER_ID && state.choice === 'points' && state.ticket
      ? computeTicket(state.ticket.liters, DEMO_TICKET.pricePerLiter, state.ticket.copilotsApplied).pointsIfAccumulate
      : 0;
  return (
    <div className="min-h-full bg-disa-bg">
      <div className="bg-disa-blue pb-5">
        <StatusBar tone="light" />
        <h1 className="px-6 pt-3 font-display text-[26px] font-medium text-white">Ofertas</h1>
        <p className="px-6 text-[14px] text-white/80">Tus cupones y premios de DISA Copilotos</p>
      </div>
      <div className="space-y-3 p-4">
        {points > 0 && (
          <div className="rounded-2xl bg-disa-yellow p-4">
            <p className="font-display text-[22px] font-bold">+{formatInt(points)} puntos</p>
            <p className="text-[13px]">Acumulados con tu pase de copilotos</p>
          </div>
        )}
        {prizes.map((p) => (
          <Coupon key={p.id} prize={p} userId={userId} />
        ))}
        {prizes.length === 0 && points === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-disa-sky bg-white p-8 text-center">
            <Gift size={36} className="text-disa-blue" />
            <p className="mt-2 font-display text-[18px] font-medium text-disa-blue">Aún no tienes premios</p>
            <p className="text-[13px] text-disa-gray">Sube al coche con tus amigos y reposta con DISA Copilotos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
