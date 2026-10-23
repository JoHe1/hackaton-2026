import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CONFIG } from '../data/config';
import { COLORS } from '../theme';

const newValue = () => `PASS-${Date.now()}`;

/** Visual-only QR that regenerates every CONFIG.qrRefreshSeconds with a countdown bar. */
export function QrRotating({ size = 200 }: { size?: number }) {
  const [value, setValue] = useState(newValue);
  const [secondsLeft, setSecondsLeft] = useState(CONFIG.qrRefreshSeconds);

  useEffect(() => {
    const rotate = setInterval(() => setValue(newValue()), CONFIG.qrRefreshSeconds * 1000);
    return () => clearInterval(rotate);
  }, []);

  useEffect(() => {
    setSecondsLeft(CONFIG.qrRefreshSeconds);
    const tick = setInterval(() => setSecondsLeft((s) => Math.max(1, s - 1)), 1000);
    return () => clearInterval(tick);
  }, [value]);

  return (
    <div className="flex flex-col items-center">
      <div key={value} className="animate-qr-flash rounded-2xl border-2 border-disa-sky bg-white p-3">
        <QRCodeSVG value={value} size={size} fgColor={COLORS.blue} level="M" />
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-disa-line" style={{ maxWidth: size + 24 }}>
        <div
          key={value}
          className="h-full origin-left rounded-full bg-disa-yellow"
          style={{ animation: `shrink ${CONFIG.qrRefreshSeconds}s linear forwards` }}
        />
      </div>
      <p className="mt-1.5 text-[12px] text-disa-gray">
        El código cambia en <span className="font-bold text-disa-blue">{secondsLeft} s</span> · solo vale en directo
      </p>
    </div>
  );
}
