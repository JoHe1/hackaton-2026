import { useMemo, useState } from 'react';
import { WHEEL, PRIZE_EMOJI } from '../data/rewards';
import { COLORS } from '../theme';

const SEGMENT = 360 / WHEEL.length;
const FULL_TURNS = 6;
const SPIN_MS = 4200;
const FILLS = [COLORS.blue, COLORS.yellow, '#2C6CB5', '#FFE27A'];

interface Props {
  /** Scripted result: the wheel always lands here. */
  result: string;
  alreadySpun: boolean;
  onDone: () => void;
  size?: number;
  disabled?: boolean;
}

function finalRotation(result: string): number {
  const index = Math.max(0, WHEEL.indexOf(result));
  return FULL_TURNS * 360 + (360 - (index * SEGMENT + SEGMENT / 2));
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function Wheel({ result, alreadySpun, onDone, size = 260, disabled = false }: Props) {
  const [spinning, setSpinning] = useState(false);
  const target = useMemo(() => finalRotation(result), [result]);
  const rotation = alreadySpun || spinning ? target : 0;

  const spin = () => {
    if (spinning || alreadySpun || disabled) return;
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      onDone();
    }, SPIN_MS);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full drop-shadow-[0_6px_14px_rgba(15,30,46,0.25)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.7, 0.1, 1)` : 'none',
          }}
        >
          <circle cx="100" cy="100" r="99" fill={COLORS.blue} />
          {WHEEL.map((prize, i) => {
            const start = polar(100, 100, 92, i * SEGMENT);
            const end = polar(100, 100, 92, (i + 1) * SEGMENT);
            const fill = FILLS[i % FILLS.length];
            const textColor = fill === COLORS.blue || fill === '#2C6CB5' ? '#fff' : COLORS.text;
            const mid = i * SEGMENT + SEGMENT / 2;
            return (
              <g key={prize}>
                <path d={`M100 100 L${start.x} ${start.y} A92 92 0 0 1 ${end.x} ${end.y} Z`} fill={fill} stroke="#fff" strokeWidth="1" />
                <g transform={`rotate(${mid} 100 100)`}>
                  <text x="100" y="30" textAnchor="middle" fontSize="15">{PRIZE_EMOJI[prize]}</text>
                  <text x="100" y="46" textAnchor="middle" fontSize="7.4" fontWeight="700" fill={textColor} fontFamily="Roboto">
                    {prize.length > 10 ? prize.split(' ')[0] : prize}
                  </text>
                </g>
              </g>
            );
          })}
          <circle cx="100" cy="100" r="16" fill="#fff" stroke={COLORS.blue} strokeWidth="3" />
          <text x="100" y="104" textAnchor="middle" fontSize="10" fontWeight="800" fontStyle="italic" fill={COLORS.blue} fontFamily="Barlow">
            DISA
          </text>
        </svg>
        <div className="absolute left-1/2 top-[-6px] -translate-x-1/2">
          <div className="h-0 w-0 border-x-[13px] border-t-[22px] border-x-transparent border-t-disa-yellow drop-shadow" />
        </div>
      </div>
      {!alreadySpun && (
        <button
          type="button"
          onClick={spin}
          disabled={spinning || disabled}
          className="mt-4 rounded-full bg-disa-blue px-8 py-3 font-display text-[17px] font-semibold text-white shadow-card disabled:opacity-60"
        >
          {spinning ? 'Girando…' : 'Girar la ruleta'}
        </button>
      )}
    </div>
  );
}
