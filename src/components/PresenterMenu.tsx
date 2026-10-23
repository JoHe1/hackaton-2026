import { useEffect, useState } from 'react';
import { MoreHorizontal, RotateCcw, X } from 'lucide-react';
import { CONFIG } from '../data/config';
import { FAR_AWAY_KM, SECURITY_MESSAGES, SMALL_REFUEL_LITERS, AI_ALERT_PASS } from '../data/security';
import { formatKm } from '../lib/format';
import { useDemoStore, type SceneId } from '../store/demoStore';

const JUMPS: { id: SceneId; label: string }[] = [
  { id: 'jumpQr', label: 'QR activo (sin copilotos)' },
  { id: 'jumpPass', label: 'Pase activo · 3 copilotos' },
  { id: 'jumpDone', label: 'Tras repostar (descuento ahora)' },
];

const SECURITY: { id: SceneId; label: string; detail: string }[] = [
  { id: 'screenshot', label: 'Escanear captura', detail: SECURITY_MESSAGES.screenshot },
  { id: 'farAway', label: 'Copiloto lejos', detail: SECURITY_MESSAGES.farAway(formatKm(FAR_AWAY_KM)) },
  { id: 'repeated', label: 'Copiloto repetido', detail: SECURITY_MESSAGES.repeated },
  { id: 'smallRefuel', label: 'Repostaje pequeño', detail: `${SMALL_REFUEL_LITERS} L · ${SECURITY_MESSAGES.smallRefuel(CONFIG.minLiters)}` },
  { id: 'expired', label: 'Pase caducado', detail: SECURITY_MESSAGES.expired },
  { id: 'locked', label: 'Sin repostaje', detail: SECURITY_MESSAGES.locked },
  { id: 'aiAlert', label: 'Alerta IA', detail: `Panel DISA · ${AI_ALERT_PASS}` },
];

const CORNERS = {
  'bottom-left': { button: 'bottom-3 left-3', panel: 'bottom-14 left-3' },
  // On a real phone the bottom-left corner is the "Inicio" tab and the top corners hold header icons.
  'top-center': { button: 'top-1 left-1/2 -translate-x-1/2', panel: 'top-11 left-3' },
};

/** Discreet presenter menu (button in a corner or key "M"): jumps and security scenes. */
export function PresenterMenu({ corner = 'bottom-left' }: { corner?: keyof typeof CORNERS }) {
  const position = CORNERS[corner];
  const [open, setOpen] = useState(false);
  const runScene = useDemoStore((s) => s.runScene);
  const restart = useDemoStore((s) => s.reset);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'm') setOpen((o) => !o);
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const run = (id: SceneId) => {
    runScene(id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Menú del presentador"
        onClick={() => setOpen((o) => !o)}
        className={`fixed ${position.button} z-[60] rounded-full bg-disa-ink/10 p-2 text-disa-ink/40 hover:bg-disa-ink/20 hover:text-disa-ink`}
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div className={`animate-fade-in fixed ${position.panel} z-[60] w-[340px] max-w-[calc(100vw-24px)] rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-disa-line`}>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-[18px] font-semibold text-disa-blue">Escenas del presentador</p>
            <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-disa-gray">Saltar a</p>
          <div className="mb-3 grid gap-1">
            {JUMPS.map((j) => (
              <button key={j.id} type="button" onClick={() => run(j.id)} className="rounded-lg px-2 py-1.5 text-left text-[14px] hover:bg-disa-bg">
                {j.label}
              </button>
            ))}
          </div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-disa-gray">Seguridad</p>
          <div className="grid gap-1">
            {SECURITY.map((s) => (
              <button key={s.id} type="button" onClick={() => run(s.id)} className="rounded-lg px-2 py-1.5 text-left hover:bg-disa-bg">
                <span className="block text-[14px] font-medium">{s.label}</span>
                <span className="block text-[12px] text-disa-gray">{s.detail}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              restart();
              setOpen(false);
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-disa-line py-2 text-[14px] font-medium text-disa-blue"
          >
            <RotateCcw size={16} /> Reiniciar demo
          </button>
        </div>
      )}
    </>
  );
}
