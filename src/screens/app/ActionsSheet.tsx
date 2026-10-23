import { ChevronRight, Fuel, QrCode, ScanLine, Cylinder } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BottomSheet } from '../../components/BottomSheet';
import { Chip } from '../../components/ui';

interface Props {
  isDriver: boolean;
  onStart: () => void;
  onJoin: () => void;
  onUnavailable: () => void;
  onClose: () => void;
}

export function ActionsSheet({ isDriver, onStart, onJoin, onUnavailable, onClose }: Props) {
  const rows: { title: string; subtitle: string; Icon: LucideIcon; onClick: () => void; isNew?: boolean }[] = [
    { title: 'Iniciar DISA Copilotos', subtitle: 'Soy quien conduce · genera el QR', Icon: QrCode, onClick: isDriver ? onStart : onUnavailable, isNew: true },
    { title: 'Unirme como copiloto', subtitle: 'Escanea el QR de quien conduce', Icon: ScanLine, onClick: isDriver ? onUnavailable : onJoin, isNew: true },
    { title: 'Pagar repostaje', subtitle: 'Pago móvil en surtidor', Icon: Fuel, onClick: onUnavailable },
    { title: 'Pedir gas', subtitle: 'Bombona a domicilio', Icon: Cylinder, onClick: onUnavailable },
  ];
  return (
    <BottomSheet title="Acciones" onClose={onClose}>
      <ul className="divide-y divide-disa-line">
        {rows.map(({ title, subtitle, Icon, onClick, isNew }) => (
          <li key={title}>
            <button type="button" onClick={onClick} className="flex w-full items-center gap-3 py-3 text-left">
              <span className={`flex h-11 w-11 items-center justify-center rounded-lg border ${isNew ? 'border-disa-blue' : 'border-disa-sky'}`}>
                <Icon size={24} strokeWidth={1.5} className="text-disa-blue" />
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-2 text-[16px] font-medium text-disa-ink">
                  {title} {isNew && <Chip>Nuevo</Chip>}
                </span>
                <span className="text-[13px] text-disa-gray">{subtitle}</span>
              </span>
              <ChevronRight size={20} className="text-disa-gray" />
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
