import { ImageIcon, X } from 'lucide-react';
import { StatusBar } from '../../components/StatusBar';
import { CONFIG } from '../../data/config';
import { DRIVER_ID, getUser, type UserId } from '../../data/users';
import { useDemoStore } from '../../store/demoStore';

/** Fake camera viewfinder. "Escanear" = live scan; "captura" = rejected screenshot. */
export function ScannerOverlay({ userId }: { userId: UserId }) {
  const scan = useDemoStore((s) => s.scan);
  const setNav = useDemoStore((s) => s.setNav);
  const driver = getUser(DRIVER_ID);
  return (
    <div className="animate-fade-in absolute inset-0 z-40 flex flex-col bg-[#0B1520] text-white">
      <StatusBar tone="light" />
      <div className="flex items-center justify-between px-5 py-2">
        <p className="font-display text-[19px] font-medium">Unirme como copiloto</p>
        <button type="button" aria-label="Cerrar" onClick={() => setNav(userId, { overlay: null })}>
          <X size={24} />
        </button>
      </div>
      <div className="relative mx-auto mt-8 h-[260px] w-[260px]">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#24384d] to-[#0f1e2e]" />
        {['left-0 top-0 border-l-4 border-t-4 rounded-tl-3xl', 'right-0 top-0 border-r-4 border-t-4 rounded-tr-3xl',
          'left-0 bottom-0 border-l-4 border-b-4 rounded-bl-3xl', 'right-0 bottom-0 border-r-4 border-b-4 rounded-br-3xl'].map((c) => (
          <span key={c} className={`absolute h-12 w-12 border-disa-yellow ${c}`} />
        ))}
        <span className="absolute inset-x-6 h-0.5 bg-disa-yellow shadow-[0_0_12px_#F6CC19]" style={{ animation: 'scanline 2.4s ease-in-out infinite' }} />
        <p className="absolute inset-x-0 bottom-6 text-center text-[13px] text-white/70">Apunta al QR del móvil de {driver.name}</p>
      </div>
      <p className="mt-6 px-8 text-center text-[13px] text-white/70">Tienes que estar en el coche, a menos de {CONFIG.maxDistanceMeters} m de quien conduce.</p>
      <div className="mt-auto space-y-3 px-6 pb-10">
        <button
          type="button"
          onClick={() => scan(userId, 'live')}
          className="w-full rounded-full bg-disa-yellow py-3.5 font-display text-[18px] font-semibold text-disa-ink"
        >
          Escanear
        </button>
        <button
          type="button"
          onClick={() => scan(userId, 'screenshot')}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-white/30 py-3 text-[15px] text-white/85"
        >
          <ImageIcon size={18} /> Escanear captura
        </button>
      </div>
    </div>
  );
}
