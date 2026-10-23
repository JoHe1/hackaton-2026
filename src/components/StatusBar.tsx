import { BellOff, Signal, Wifi } from 'lucide-react';
import { CLOCK } from '../data/home';
import { usePhone } from '../lib/phoneContext';

interface Props {
  tone?: 'light' | 'dark';
}

/** Android status bar, only drawn inside a PhoneFrame. */
export function StatusBar({ tone = 'light' }: Props) {
  const { framed } = usePhone();
  if (!framed) return null;
  const color = tone === 'light' ? 'text-white' : 'text-disa-ink';
  return (
    <div className={`flex h-10 items-center justify-between px-7 pt-1 text-[15px] font-medium ${color}`}>
      <span>{CLOCK}</span>
      <span className="flex items-center gap-1.5">
        <BellOff size={15} strokeWidth={2.2} />
        <Signal size={15} strokeWidth={2.4} />
        <Wifi size={15} strokeWidth={2.4} />
        <span className="ml-0.5 flex h-[13px] w-[24px] items-center rounded-[3px] border-[1.5px] border-current px-[2px]">
          <span className="h-[7px] w-[60%] rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  );
}

export const SYSTEM_NAV_HEIGHT = 40;

/** Android 3-button navigation bar at the bottom of the device. */
export function SystemNavBar() {
  const { framed } = usePhone();
  if (!framed) return null;
  return (
    <div style={{ height: SYSTEM_NAV_HEIGHT }} className="flex items-center justify-center gap-20 bg-white text-[#5f6368]">
      <span className="h-3.5 w-3.5 rounded-[3px] bg-current" />
      <span className="h-4 w-4 rounded-full border-[3px] border-current" />
      <span className="h-0 w-0 border-y-[8px] border-r-[12px] border-y-transparent border-r-current" />
    </div>
  );
}
