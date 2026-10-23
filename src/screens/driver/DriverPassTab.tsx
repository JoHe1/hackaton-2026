import { Check, Info, ShieldAlert } from 'lucide-react';
import { Avatar } from '../../components/Avatar';
import { PassCard } from '../../components/PassCard';
import { QrRotating } from '../../components/QrRotating';
import { Ticket } from '../../components/Ticket';
import { Wheel } from '../../components/Wheel';
import { Card, Chip, PrimaryButton } from '../../components/ui';
import { CONFIG } from '../../data/config';
import { DEMO_UNAVAILABLE } from '../../data/home';
import { COPILOT_REWARDS, DRIVER_SPIN_RESULT, PRIZE_EMOJI } from '../../data/rewards';
import { STATIONS } from '../../data/stations';
import { DEMO_TICKET } from '../../data/ticket';
import { DRIVER_ID, getUser } from '../../data/users';
import { formatEur, formatInt } from '../../lib/format';
import { computeTicket, discountCentsPerLiter, driverSpinsFor } from '../../lib/pricing';
import { useNow } from '../../lib/useNow';
import { passRemainingSeconds, useDemoStore } from '../../store/demoStore';

const station = STATIONS.find((s) => s.id === DEMO_TICKET.station) ?? STATIONS[0];

export function DriverPassTab() {
  const phase = useDemoStore((s) => s.phase);
  if (phase === 'idle') return <StartCard />;
  if (phase === 'qr') return <QrStep />;
  if (phase === 'pass') return <ActivePass />;
  return <AfterRefuel />;
}

function StartCard() {
  const start = useDemoStore((s) => s.startCopilots);
  const rules = [
    `${CONFIG.centsPerLiterPerCopilot} c/L menos por cada copiloto (hasta ${CONFIG.maxCopilots})`,
    `Mínimo ${CONFIG.minLiters} L · pase válido ${CONFIG.passMinutes} min`,
    'Tus copilotos ganan un premio para la tienda',
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-disa-yellow p-5">
        <p className="font-display text-[24px] font-bold italic leading-tight text-disa-blue">Cuantos más vais en el coche, menos pagas.</p>
        <p className="mt-1 text-[14px] text-disa-ink">Y tus copilotos también ganan.</p>
      </div>
      <Card>
        <ul className="space-y-2">
          {rules.map((r) => (
            <li key={r} className="flex items-start gap-2 text-[14px]">
              <Check size={18} className="shrink-0 text-disa-green" /> {r}
            </li>
          ))}
        </ul>
      </Card>
      <PrimaryButton onClick={start}>Iniciar DISA Copilotos</PrimaryButton>
      <p className="flex items-center justify-center gap-1 text-[12px] text-disa-gray">
        <Info size={13} /> Hazlo con el coche parado
      </p>
    </div>
  );
}

function QrStep() {
  const joined = useDemoStore((s) => s.joined);
  const rejected = useDemoStore((s) => s.rejected);
  const confirm = useDemoStore((s) => s.confirmPass);
  const slots = Array.from({ length: CONFIG.maxCopilots }, (_, i) => joined[i]);
  return (
    <div className="space-y-4">
      <Card className="flex flex-col items-center">
        <p className="mb-3 text-center font-display text-[18px] font-medium text-disa-blue">Que tus copilotos escaneen este código</p>
        <QrRotating size={180} />
      </Card>
      <Card>
        <div className="mb-2 flex items-center justify-between">
          <p className="font-display text-[16px] font-semibold">Copilotos ({joined.length}/{CONFIG.maxCopilots})</p>
          {joined.length > 0 && <Chip tone="green">−{discountCentsPerLiter(joined.length)} c/L</Chip>}
        </div>
        <div className="flex justify-around">
          {slots.map((id, i) =>
            id ? (
              <div key={id} className="animate-pop flex flex-col items-center gap-1">
                <Avatar userId={id} size={52} checked />
                <span className="text-[13px] font-medium">{getUser(id).name}</span>
              </div>
            ) : (
              <div key={`empty-${i}`} className="flex flex-col items-center gap-1">
                <span className="h-[52px] w-[52px] rounded-full border-2 border-dashed border-disa-sky" />
                <span className="text-[13px] text-disa-gray">Libre</span>
              </div>
            ),
          )}
        </div>
        {rejected.map((r, i) => (
          <p key={`${r.userId}-${i}`} className="mt-3 flex items-center gap-1.5 rounded-lg bg-[#FDECEC] px-3 py-2 text-[12px] text-disa-red">
            <ShieldAlert size={14} /> {getUser(r.userId).name}: {r.reason}
          </p>
        ))}
      </Card>
      <PrimaryButton onClick={confirm} disabled={joined.length === 0}>
        OK · Crear pase
      </PrimaryButton>
    </div>
  );
}

function ActivePass() {
  const state = useDemoStore();
  const now = useNow();
  const remaining = passRemainingSeconds(state, now);
  const ticket = state.ticket;
  const awaitingChoice = ticket && !ticket.closed && ticket.copilotsApplied > 0;
  return (
    <div className="space-y-4">
      <PassCard driverId={DRIVER_ID} copilots={state.joined} remainingSeconds={remaining} />
      {awaitingChoice ? (
        <SavingsChoiceCard />
      ) : (
        <Card>
          <p className="font-display text-[16px] font-semibold text-disa-blue">Ahora, a repostar</p>
          <p className="mt-1 text-[13px] text-disa-gray">
            Paga en caja con tu tarjeta DISA: el pase se detecta solo. Mínimo {CONFIG.minLiters} L.
          </p>
        </Card>
      )}
      <LockedCopilots />
    </div>
  );
}

function SavingsChoiceCard() {
  const ticket = useDemoStore((s) => s.ticket);
  const choose = useDemoStore((s) => s.chooseSavings);
  if (!ticket) return null;
  const breakdown = computeTicket(ticket.liters, station.diesel, ticket.copilotsApplied);
  return (
    <Card className="animate-pop border-disa-yellow ring-2 ring-disa-yellow/50">
      <p className="font-display text-[18px] font-semibold text-disa-blue">Pase aplicado en caja</p>
      <p className="mb-3 text-[13px] text-disa-gray">¿Cómo quieres tu ahorro?</p>
      <Ticket breakdown={breakdown} product={DEMO_TICKET.product} stationName={station.name} choice={null} compact />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <PrimaryButton onClick={() => choose('discount')} className="!px-2 !text-[15px]">
          Descuento ahora
          <span className="block text-[12px] font-normal">−{formatEur(breakdown.discount)}</span>
        </PrimaryButton>
        <PrimaryButton tone="outline" onClick={() => choose('points')} className="!px-2 !text-[15px]">
          Acumular puntos
          <span className="block text-[12px] font-normal">+{formatInt(breakdown.pointsIfAccumulate)} puntos</span>
        </PrimaryButton>
      </div>
    </Card>
  );
}

function LockedCopilots() {
  const joined = useDemoStore((s) => s.joined);
  return (
    <Card>
      <p className="mb-2 font-display text-[16px] font-semibold">Premios de tus copilotos</p>
      <div className="flex gap-3">
        {joined.map((id) => (
          <div key={id} className="flex items-center gap-2">
            <Avatar userId={id} size={30} />
            <span className="text-[18px]">🔒</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-disa-gray">Se desbloquean cuando repostes.</p>
    </Card>
  );
}

function AfterRefuel() {
  const state = useDemoStore();
  const showToast = useDemoStore((s) => s.showToast);
  const markDriverSpun = useDemoStore((s) => s.markDriverSpun);
  if (!state.ticket) return null;
  const breakdown = computeTicket(state.ticket.liters, station.diesel, state.ticket.copilotsApplied);
  const paid = state.choice === 'points' ? breakdown.gross : breakdown.total;
  const spins = driverSpinsFor(paid);
  const spun = state.driverSpinsUsed > 0;
  return (
    <div className="space-y-4">
      <Card className="flex flex-col items-center">
        <Chip tone="yellow">1 pase por cada {CONFIG.euroPerDriverSpin} € pagados</Chip>
        <p className="mt-2 text-center font-display text-[22px] font-bold text-disa-blue">Has ganado {spins} pases de ruleta</p>
        <div className="mt-3">
          <Wheel result={DRIVER_SPIN_RESULT} alreadySpun={spun} onDone={markDriverSpun} size={230} />
        </div>
        {spun && (
          <div className="animate-pop mt-3 text-center">
            <p className="font-display text-[22px] font-bold">
              {PRIZE_EMOJI[DRIVER_SPIN_RESULT]} ¡Te ha tocado {DRIVER_SPIN_RESULT}!
            </p>
            <p className="text-[13px] text-disa-gray">Te quedan {spins - state.driverSpinsUsed} pases · lo tienes en Ofertas</p>
            <button type="button" onClick={() => showToast(DRIVER_ID, DEMO_UNAVAILABLE)} className="mt-2 text-[14px] font-medium text-disa-blue underline">
              Girar otra vez
            </button>
          </div>
        )}
      </Card>
      <Card>
        <Ticket breakdown={breakdown} product={DEMO_TICKET.product} stationName={station.name} choice={state.choice} compact />
      </Card>
      <Card>
        <p className="mb-2 font-display text-[16px] font-semibold">Tus copilotos han desbloqueado su premio</p>
        {state.joined.map((id) => (
          <div key={id} className="flex items-center gap-2 py-1 text-[14px]">
            <Avatar userId={id} size={28} />
            <span className="flex-1">{getUser(id).name}</span>
            <span className="text-disa-gray">{COPILOT_REWARDS[id]?.type === 'cupon' ? 'Cupón directo' : 'Ruleta'}</span>
            <span>🔓</span>
          </div>
        ))}
      </Card>
      <PassCard driverId={DRIVER_ID} copilots={state.joined} remainingSeconds={0} consumed />
    </div>
  );
}
