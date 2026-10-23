import { useState } from 'react';
import { BadgeCheck, CreditCard, Fuel, ShieldAlert, Users } from 'lucide-react';
import { StatusBar, SYSTEM_NAV_HEIGHT, SystemNavBar } from '../../components/StatusBar';
import { Ticket } from '../../components/Ticket';
import { ToastHost } from '../../components/ToastHost';
import { PrimaryButton } from '../../components/ui';
import { CONFIG } from '../../data/config';
import { STATIONS } from '../../data/stations';
import { DEMO_CARD, DEMO_TICKET } from '../../data/ticket';
import { getUser } from '../../data/users';
import { SECURITY_MESSAGES } from '../../data/security';
import { formatEur, formatInt, formatPricePerLiter } from '../../lib/format';
import { computeTicket, discountCentsPerLiter } from '../../lib/pricing';
import { usePhone } from '../../lib/phoneContext';
import { useNow } from '../../lib/useNow';
import { isPassUsable, passRemainingSeconds, useDemoStore } from '../../store/demoStore';

const station = STATIONS.find((s) => s.id === DEMO_TICKET.station) ?? STATIONS[0];

/** Cashier / pump simulator. */
export function PosScreen() {
  const posStep = useDemoStore((s) => s.posStep);
  const { framed } = usePhone();
  return (
    <div className="absolute inset-0 flex flex-col bg-[#EEF2F6]">
      <div className="bg-[#0F1E2E] text-white">
        <StatusBar tone="light" />
        <div className="flex items-center justify-between px-5 pb-3 pt-1">
          <div>
            <p className="font-display text-[13px] uppercase tracking-[0.2em] text-disa-yellow">Caja · TPV</p>
            <p className="font-display text-[20px] font-medium">{station.name}</p>
          </div>
          <Fuel size={28} className="text-disa-yellow" />
        </div>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {posStep === 'idle' && <SwipeStep />}
        {posStep === 'card' && <LitersStep />}
        {posStep === 'ticket' && <TicketStep />}
      </div>
      <SystemNavBar />
      <ToastHost device="pos" bottom={(framed ? SYSTEM_NAV_HEIGHT : 0) + 16} />
    </div>
  );
}

function SwipeStep() {
  const swipe = useDemoStore((s) => s.swipeCard);
  const holder = getUser(DEMO_CARD.holder);
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="relative h-[150px] w-[240px] rounded-2xl bg-gradient-to-br from-disa-blue to-[#2C6CB5] p-4 text-left text-white shadow-card">
        <p className="font-display text-[22px] font-extrabold italic">DISA</p>
        <p className="absolute bottom-10 left-4 font-mono text-[15px] tracking-widest">{DEMO_CARD.masked}</p>
        <p className="absolute bottom-4 left-4 text-[13px]">{holder.name}</p>
        <span className="absolute right-4 top-5 h-7 w-9 rounded bg-disa-yellow/90" />
      </div>
      <p className="mt-6 font-display text-[20px] font-medium text-disa-ink">Pasa la tarjeta DISA del cliente</p>
      <div className="mt-6 w-full">
        <PrimaryButton onClick={swipe}>
          <span className="inline-flex items-center gap-2">
            <CreditCard size={20} /> Pasar tarjeta de {holder.name}
          </span>
        </PrimaryButton>
      </div>
    </div>
  );
}

function PassDetection() {
  const state = useDemoStore();
  const now = useNow();
  if (isPassUsable(state, now)) {
    return (
      <div className="animate-pop flex items-start gap-3 rounded-xl bg-disa-green p-3 text-white">
        <BadgeCheck size={26} className="shrink-0" />
        <div>
          <p className="font-display text-[18px] font-semibold">Pase de copilotos detectado</p>
          <p className="text-[13px]">
            <Users size={13} className="inline" /> {state.joined.length} copilotos · −{discountCentsPerLiter(state.joined.length)} c/L · mín. {CONFIG.minLiters} L
          </p>
        </div>
      </div>
    );
  }
  if (state.phase === 'pass' && passRemainingSeconds(state, now) <= 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-[#D7DDE3] p-3 text-disa-gray">
        <ShieldAlert size={20} /> Pase de copilotos · {SECURITY_MESSAGES.expired}
      </div>
    );
  }
  return <div className="rounded-xl bg-white p-3 text-[14px] text-disa-gray">Sin pase de copilotos activo</div>;
}

function LitersStep() {
  const charge = useDemoStore((s) => s.charge);
  const [liters, setLiters] = useState(String(DEMO_TICKET.liters));
  const holder = getUser(DEMO_CARD.holder);
  const value = Number(liters.replace(',', '.'));
  const valid = Number.isFinite(value) && value > 0;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-white p-3">
        <CreditCard className="text-disa-blue" />
        <div className="flex-1">
          <p className="font-medium">{holder.name}</p>
          <p className="font-mono text-[12px] text-disa-gray">Tarjeta DISA {DEMO_CARD.masked}</p>
        </div>
      </div>
      <PassDetection />
      <div className="rounded-xl bg-white p-4">
        <p className="text-[13px] text-disa-gray">Producto</p>
        <p className="font-display text-[20px] font-semibold">
          {DEMO_TICKET.product} · {formatPricePerLiter(station.diesel)}
        </p>
        <label className="mt-3 block text-[13px] text-disa-gray" htmlFor="pos-liters">
          Litros
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id="pos-liters"
            inputMode="decimal"
            value={liters}
            onChange={(e) => setLiters(e.target.value.replace(/[^0-9.,]/g, ''))}
            className="w-full rounded-lg border border-disa-line px-3 py-2 font-mono text-[24px] outline-none focus:border-disa-blue"
          />
          <span className="font-display text-[20px]">L</span>
        </div>
        {valid && <p className="mt-1 text-right text-[13px] text-disa-gray">{formatEur(value * station.diesel)}</p>}
      </div>
      <PrimaryButton onClick={() => charge(value)} disabled={!valid}>
        Cobrar
      </PrimaryButton>
    </div>
  );
}

function TicketStep() {
  const ticket = useDemoStore((s) => s.ticket);
  const choice = useDemoStore((s) => s.choice);
  const choose = useDemoStore((s) => s.chooseSavings);
  const swipe = useDemoStore((s) => s.swipeCard);
  const holder = getUser(DEMO_CARD.holder);
  if (!ticket) return null;
  const breakdown = computeTicket(ticket.liters, station.diesel, ticket.copilotsApplied);
  const awaiting = !ticket.closed && breakdown.passApplies;
  const rejectedSmall = ticket.closed && !breakdown.passApplies && ticket.liters < CONFIG.minLiters;
  return (
    <div className="space-y-4">
      <Ticket breakdown={breakdown} product={DEMO_TICKET.product} stationName={station.name} choice={choice} />
      {rejectedSmall && (
        <p className="flex items-center gap-2 rounded-xl bg-[#FDECEC] p-3 text-[14px] font-medium text-disa-red">
          <ShieldAlert size={18} /> {SECURITY_MESSAGES.smallRefuel(CONFIG.minLiters)}
        </p>
      )}
      {awaiting && (
        <div className="rounded-xl bg-white p-4">
          <p className="text-center text-[14px] text-disa-gray">Esperando la elección de {holder.name} en su app…</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <PrimaryButton onClick={() => choose('discount')} className="!text-[15px]">Descuento ahora</PrimaryButton>
            <PrimaryButton tone="outline" onClick={() => choose('points')} className="!text-[15px]">Acumular puntos</PrimaryButton>
          </div>
        </div>
      )}
      {ticket.closed && breakdown.passApplies && (
        <div className="animate-pop rounded-xl bg-disa-green p-4 text-center text-white">
          <p className="font-display text-[20px] font-semibold">
            {choice === 'points' ? `+${formatInt(breakdown.pointsIfAccumulate)} puntos para ${holder.name}` : `${holder.name} ahorra ${formatEur(breakdown.discount)}`}
          </p>
          <p className="text-[13px]">Pase consumido · premios de copilotos desbloqueados</p>
        </div>
      )}
      {ticket.closed && (
        <button type="button" onClick={swipe} className="w-full py-2 text-[14px] font-medium text-disa-blue underline">
          Nuevo cobro
        </button>
      )}
    </div>
  );
}
