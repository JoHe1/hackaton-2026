import { useRef, useState } from 'react';
import { Bell, Bird, CarFront, ChevronRight, Cylinder, PlugZap, Fuel, UserCog, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DisaLogo } from '../../components/DisaLogo';
import { StatusBar } from '../../components/StatusBar';
import { HOME_PROMO } from '../../data/home';
import { getUser, type UserId } from '../../data/users';

interface Props {
  userId: UserId;
  onOpenCopilotos: () => void;
  onUnavailable: () => void;
}

export function HomeScreen({ userId, onOpenCopilotos, onUnavailable }: Props) {
  const user = getUser(userId);
  return (
    <div className="relative bg-white pb-6">
      {/* Blue header + carousel sit on the same blue background, then a white sheet with rounded corner. */}
      <div className="bg-disa-blue">
        <StatusBar tone="light" />
        <header className="flex items-start justify-between px-7 pb-3 pt-3 text-white">
          <h1 className="text-[21px] leading-[1.18]">
            ¡Hola,
            <br />
            {user.name}!
          </h1>
          <div className="flex items-center gap-6 pt-2">
            <button type="button" aria-label="Notificaciones" onClick={onUnavailable}>
              <Bell size={25} fill="currentColor" strokeWidth={1.6} />
            </button>
            <button type="button" aria-label="Ajustes de perfil" onClick={onUnavailable}>
              <UserCog size={25} strokeWidth={2.2} />
            </button>
          </div>
        </header>
      </div>
      <Carousel onOpenCopilotos={onOpenCopilotos} onUnavailable={onUnavailable} />
      <Shortcuts onOpenCopilotos={onOpenCopilotos} onUnavailable={onUnavailable} />
      <PromoBlock onUnavailable={onUnavailable} />
      <Promotions onUnavailable={onUnavailable} />
      <PointsRow onUnavailable={onUnavailable} />
    </div>
  );
}

// ---------- carousel ----------

const CARD_WIDTH = 330;
const CARD_GAP = 12;

function Carousel({ onOpenCopilotos, onUnavailable }: { onOpenCopilotos: () => void; onUnavailable: () => void }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const onScroll = () => {
    const x = scroller.current?.scrollLeft ?? 0;
    setActive(Math.round(x / (CARD_WIDTH + CARD_GAP)));
  };
  return (
    <div className="relative">
      {/* blue top half behind the cards, white rounded sheet below */}
      <div className="absolute inset-x-0 top-0 h-[80px] bg-disa-blue" />
      <div className="absolute inset-x-0 top-[80px] h-10 rounded-tl-[44px] bg-white" />
      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-3 overflow-x-auto px-[30px] pb-3 pt-0"
      >
        <CopilotosCard onClick={onOpenCopilotos} />
        <ClubCard onClick={onUnavailable} />
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {[0, 1].map((i) => (
          <span key={i} className={`h-[9px] rounded-full transition-all ${i === active ? 'w-[26px] bg-disa-blue' : 'w-[9px] bg-[#C9DAEE]'}`} />
        ))}
      </div>
    </div>
  );
}

function CardShell({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative h-[156px] shrink-0 snap-center overflow-hidden rounded-md bg-white text-left shadow-card"
      style={{ width: CARD_WIDTH }}
    >
      {children}
    </button>
  );
}

function CopilotosCard({ onClick }: { onClick: () => void }) {
  return (
    <CardShell onClick={onClick} label="DISA Copilotos">
      <div className="flex h-[58px] items-center justify-between px-4">
        <div>
          <span className="rounded-sm bg-disa-yellow px-1.5 py-[1px] font-display text-[11px] font-bold tracking-wider text-disa-ink">NUEVO</span>
          <p className="font-display text-[23px] font-medium leading-tight text-disa-blue">DISA Copilotos</p>
        </div>
        <DisaLogo variant="wordmark" width={56} />
      </div>
      <div className="relative h-[98px] bg-disa-blue px-4 pt-3">
        <p className="font-display text-[19px] font-semibold italic leading-tight text-disa-yellow">
          Llena el coche,
          <br />
          no solo el depósito
        </p>
        <span className="absolute right-4 top-2 text-[40px] leading-none">🚗</span>
        <div className="absolute -bottom-6 left-[-10%] h-12 w-[120%] rounded-[50%] bg-white" />
      </div>
    </CardShell>
  );
}

function ClubCard({ onClick }: { onClick: () => void }) {
  return (
    <CardShell onClick={onClick} label="Tu Club">
      <div className="flex h-[58px] items-center justify-between px-4">
        <p className="font-display text-[27px] font-medium text-disa-blue">Tu Club</p>
        <DisaLogo variant="wordmark" width={56} />
      </div>
      <div className="relative h-[98px] bg-disa-yellow">
        <span className="absolute right-[38%] top-[-34px] text-[64px] leading-none">🏍️</span>
        <div className="absolute -bottom-2 left-[-10%] h-14 w-[120%] rounded-[50%] bg-white" />
      </div>
    </CardShell>
  );
}

// ---------- shortcuts ----------

interface Shortcut {
  label: string;
  Icon?: LucideIcon;
  bird?: boolean;
  isNew?: boolean;
  copilotos?: boolean;
}

const SHORTCUTS: Shortcut[] = [
  { label: 'Copilotos', Icon: UsersRound, isNew: true, copilotos: true },
  { label: 'Pago móvil', Icon: Fuel },
  { label: 'Pedir gas', Icon: Cylinder },
  { label: 'Recarga', Icon: PlugZap },
  { label: 'Lavados', Icon: CarFront },
  { label: 'DISAPass', bird: true },
];

function Shortcuts({ onOpenCopilotos, onUnavailable }: { onOpenCopilotos: () => void; onUnavailable: () => void }) {
  return (
    <div className="no-scrollbar mt-6 flex gap-[14px] overflow-x-auto px-4">
      {SHORTCUTS.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={s.copilotos ? onOpenCopilotos : onUnavailable}
          className="flex w-[62px] shrink-0 flex-col items-center"
        >
          <span
            className={`relative flex h-[62px] w-[62px] items-center justify-center rounded-lg border bg-white ${
              s.copilotos ? 'border-disa-blue' : 'border-disa-sky'
            }`}
          >
            {s.Icon && <s.Icon size={30} strokeWidth={1.5} className="text-disa-blue" />}
            {s.bird && (
              <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full border-[1.6px] border-disa-blue">
                <Bird size={20} strokeWidth={1.6} className="text-disa-blue" />
              </span>
            )}
            {s.isNew && <span className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-disa-yellow" />}
          </span>
          <span className={`mt-1.5 whitespace-nowrap text-[13px] ${s.copilotos ? 'font-medium text-disa-blue' : 'text-disa-gray'}`}>
            {s.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ---------- decorative blocks copied from the official home ----------

function PromoBlock({ onUnavailable }: { onUnavailable: () => void }) {
  const [l1, l2, h1, l3, h2] = HOME_PROMO.lines;
  return (
    <button type="button" onClick={onUnavailable} className="mt-8 flex w-full items-center gap-2 px-6 text-left">
      <div className="flex-1">
        <p className="font-display text-[16px] font-medium leading-[1.3] text-disa-blue">
          {l1}
          <br />
          {l2} <mark className="rounded-sm bg-disa-yellow px-0.5 text-disa-blue">{h1}</mark>
          <br />
          {l3} <mark className="rounded-sm bg-disa-yellow px-0.5 text-disa-blue">{h2}</mark>
        </p>
        <p className="mt-2 pl-6 font-display text-[26px] font-semibold leading-none text-[#6B5A12]">
          {HOME_PROMO.price} <span className="text-[17px]">{HOME_PROMO.unit}</span>
        </p>
        <p className="pl-6 font-display text-[16px] font-medium text-[#6B5A12]">{HOME_PROMO.claim}</p>
      </div>
      <div className="relative flex h-[118px] w-[130px] shrink-0 items-center justify-center rounded-full bg-[#DCE7F3]">
        <div className="w-[78px] overflow-hidden rounded-md bg-white shadow">
          <div className="h-3 bg-disa-blue" />
          <p className="text-center font-display text-[30px] font-bold leading-none text-disa-blue">{HOME_PROMO.months}</p>
          <p className="pb-1 text-center font-display text-[10px] font-bold text-disa-blue">MESES</p>
        </div>
        <span className="absolute -bottom-1 left-[-12px] -rotate-6 rounded-sm bg-disa-yellow px-2 py-0.5 text-[8px] font-medium italic text-disa-ink">
          ¡Nueva oportunidad!
        </span>
      </div>
    </button>
  );
}

function Promotions({ onUnavailable }: { onUnavailable: () => void }) {
  return (
    <section className="mt-9">
      <h2 className="px-4 font-display text-[22px] font-medium text-disa-blue">Promociones</h2>
      <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto px-4">
        <button type="button" onClick={onUnavailable} className="relative h-[104px] w-[214px] shrink-0 overflow-hidden rounded bg-disa-yellow text-left">
          <div className="absolute left-6 top-6 h-[56px] w-[200px] rounded-l-md bg-disa-blue px-4 py-1.5 text-white">
            <p className="font-display text-[9px] italic">Programa de Pilotos</p>
            <p className="font-display text-[17px] font-bold italic leading-none">Tu Club DISA</p>
            <p className="font-display text-[8px] italic">COPI SPORT</p>
          </div>
          <span className="absolute -left-3 top-7 text-[36px]">⛑️</span>
        </button>
        <button type="button" onClick={onUnavailable} className="flex h-[104px] w-[150px] shrink-0 items-center justify-center rounded bg-[#FBF3DF] text-[46px]">
          🛋️
        </button>
      </div>
    </section>
  );
}

function PointsRow({ onUnavailable }: { onUnavailable: () => void }) {
  return (
    <section className="mt-7">
      <button type="button" onClick={onUnavailable} className="flex w-full items-center justify-between px-4">
        <h2 className="font-display text-[22px] font-medium text-disa-blue">Convierte tus puntos en</h2>
        <ChevronRight size={26} className="text-[#8C7A1E]" />
      </button>
      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4">
        <div className="h-[96px] w-[250px] shrink-0 rounded bg-gradient-to-br from-[#E9C9A8] to-[#C4683E]" />
        <div className="h-[96px] w-[120px] shrink-0 rounded bg-gradient-to-br from-[#2E6E8E] to-[#173B4C]" />
      </div>
    </section>
  );
}
