import { Share2, X } from 'lucide-react';
import { SUMMER_CHALLENGE, SUMMER_WRAPPED } from '../data/summer';
import { formatInt } from '../lib/format';
import { DisaLogo } from './DisaLogo';

interface Props {
  onShare: () => void;
  onClose: () => void;
}

/** Shareable 9:16 story card ("Wrapped" style). */
export function SummerWrapped({ onShare, onClose }: Props) {
  const stats = [
    { label: 'veces con el coche lleno', value: formatInt(SUMMER_WRAPPED.fullCar) },
    { label: 'racha máxima', value: SUMMER_WRAPPED.bestStreak },
    { label: 'copiloto favorito', value: SUMMER_WRAPPED.favouriteCopilot },
    { label: 'kg de CO₂ ahorrados', value: formatInt(SUMMER_WRAPPED.co2SavedKg) },
    { label: 'mejor premio', value: SUMMER_WRAPPED.topPrize },
  ];
  return (
    <div className="animate-fade-in absolute inset-0 z-40 flex flex-col items-center justify-center bg-disa-ink px-4">
      <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-12 z-10 rounded-full bg-white/15 p-2 text-white">
        <X size={20} />
      </button>
      <div
        className="animate-pop relative flex w-full flex-col overflow-hidden rounded-3xl bg-disa-blue p-6 text-white shadow-2xl"
        style={{ aspectRatio: '9 / 16', maxHeight: 'calc(100% - 140px)' }}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-disa-yellow/90" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#2C6CB5]" />
        <div className="relative flex items-center justify-between">
          <span className="rounded-md bg-white px-1.5 py-1"><DisaLogo variant="wordmark" width={58} /></span>
          <span className="font-display text-[13px] font-semibold text-disa-ink">{SUMMER_CHALLENGE.season}</span>
        </div>
        <p className="relative mt-6 font-display text-[30px] font-bold italic leading-none">{SUMMER_WRAPPED.title}</p>
        <p className="relative mt-4 font-display text-[88px] font-extrabold italic leading-none text-disa-yellow">
          {SUMMER_WRAPPED.refuelsTogether}
        </p>
        <p className="relative font-display text-[20px] font-semibold leading-tight">repostajes con tu gente</p>
        <div className="relative mt-auto grid grid-cols-2 gap-2">
          {stats.map((s, i) => (
            <div key={s.label} className={`rounded-xl bg-white/12 p-2.5 backdrop-blur ${i === stats.length - 1 ? 'col-span-2' : ''}`} style={{ background: 'rgba(255,255,255,0.13)' }}>
              <p className="font-display text-[17px] font-bold leading-tight">{s.value}</p>
              <p className="text-[11px] text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="relative mt-3 text-center font-display text-[13px] italic text-white/90">Llena el coche, no solo el depósito.</p>
      </div>
      <div className="mt-4 flex w-full gap-3">
        <button
          type="button"
          onClick={onShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-disa-yellow py-3 font-display text-[17px] font-semibold text-disa-ink"
        >
          <Share2 size={18} /> Compartir
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-white/60">Guardada en tu historial · {SUMMER_WRAPPED.shareText}</p>
    </div>
  );
}
