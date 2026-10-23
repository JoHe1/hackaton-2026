import type { ReactNode } from 'react';
import { PhoneContext } from '../lib/phoneContext';

export const PHONE_WIDTH = 390;
export const PHONE_HEIGHT = 844;
const BEZEL = 12;
export const FRAME_WIDTH = PHONE_WIDTH + BEZEL * 2;
export const FRAME_HEIGHT = PHONE_HEIGHT + BEZEL * 2;

interface Props {
  children: ReactNode;
  /** Render full screen (real phone) instead of a drawn device. */
  bare?: boolean;
}

export function PhoneFrame({ children, bare = false }: Props) {
  if (bare) {
    return (
      <PhoneContext.Provider value={{ framed: false }}>
        <div className="relative h-[100dvh] w-full overflow-hidden bg-white">{children}</div>
      </PhoneContext.Provider>
    );
  }
  return (
    <PhoneContext.Provider value={{ framed: true }}>
      <div
        className="relative shrink-0 rounded-[52px] bg-[#11161c] shadow-[0_24px_60px_rgba(15,30,46,0.35)]"
        style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT, padding: BEZEL }}
      >
        <div
          className="relative overflow-hidden rounded-[42px] bg-white"
          style={{ width: PHONE_WIDTH, height: PHONE_HEIGHT, transform: 'translateZ(0)' }}
        >
          {children}
        </div>
      </div>
    </PhoneContext.Provider>
  );
}
