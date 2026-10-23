import { House, MapPin, Plus, Star } from 'lucide-react';
import { DisaLogo } from '../../components/DisaLogo';
import type { AppTab } from '../../store/demoStore';

export const BOTTOM_NAV_HEIGHT = 64;

interface Props {
  tab: AppTab;
  onTab: (tab: AppTab) => void;
  onActions: () => void;
  onUnavailable: () => void;
}

export function BottomNav({ tab, onTab, onActions, onUnavailable }: Props) {
  const homeActive = tab === 'inicio' || tab === 'copilotos';
  const item = (active: boolean) => `flex w-[72px] flex-col items-center gap-0.5 text-[14px] ${active ? 'text-disa-blue' : 'text-disa-gray'}`;
  return (
    <nav style={{ height: BOTTOM_NAV_HEIGHT }} className="relative z-30 flex items-end justify-around border-t border-disa-line bg-white pb-2">
      <button type="button" className={item(homeActive)} onClick={() => onTab('inicio')}>
        <span className="flex h-7 items-end">
          <DisaLogo variant="bird" width={34} className={homeActive ? '' : 'opacity-60 grayscale'} />
        </span>
        Inicio
      </button>
      <button type="button" className={item(tab === 'ofertas')} onClick={() => onTab('ofertas')}>
        <Star size={27} strokeWidth={1.3} />
        Ofertas
      </button>
      <button type="button" className={`${item(false)} relative`} onClick={onActions}>
        <span className="absolute -top-[46px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-disa-blue text-white shadow-card">
          <Plus size={28} strokeWidth={1.8} />
        </span>
        <span className="h-7" />
        Acciones
      </button>
      <button type="button" className={item(false)} onClick={onUnavailable}>
        <MapPin size={27} strokeWidth={1.3} />
        Mapa
      </button>
      <button type="button" className={item(false)} onClick={onUnavailable}>
        <House size={27} strokeWidth={1.3} />
        Hogar
      </button>
    </nav>
  );
}
