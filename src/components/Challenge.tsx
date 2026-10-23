import { Check, Gift } from 'lucide-react';
import { CHALLENGES } from '../data/challenges';
import { PRIZE_EMOJI } from '../data/rewards';
import { Card, Chip, ProgressBar } from './ui';

interface Props {
  refuelsTogether: number;
  memberNames: string[];
  justCompleted: boolean;
}

/** Group challenge: refuels with the same people (3 · 5 · 10). */
export function Challenge({ refuelsTogether, memberNames, justCompleted }: Props) {
  const next = CHALLENGES.find((c) => refuelsTogether < c.at) ?? CHALLENGES[CHALLENGES.length - 1];
  const current = [...CHALLENGES].reverse().find((c) => refuelsTogether >= c.at);
  const highlight = justCompleted && current ? current : null;
  return (
    <Card className={highlight ? 'border-disa-green ring-2 ring-disa-green/30' : ''}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-[17px] font-semibold text-disa-ink">Reto del grupo</p>
          <p className="text-[12px] text-disa-gray">Repostajes juntos con {memberNames.join(', ')}</p>
        </div>
        <Chip tone="blue">Todos ganan</Chip>
      </div>
      {highlight ? (
        <div className="animate-pop mt-3 flex items-center gap-3 rounded-xl bg-[#E3F3EA] p-3">
          <span className="text-[28px]">{PRIZE_EMOJI[highlight.prize]}</span>
          <div>
            <p className="font-display text-[18px] font-bold text-disa-green">
              {highlight.at}/{highlight.at} repostajes juntos → {highlight.prize.toLowerCase()}
            </p>
            <p className="text-[12px] text-disa-green">¡Conseguido! {highlight.prize} para todos</p>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[13px]">
            <span className="font-bold text-disa-blue">{refuelsTogether}/{next.at} repostajes</span>
            <span className="text-disa-gray">→ {next.prize} para todos</span>
          </div>
          <ProgressBar value={refuelsTogether} max={next.at} />
        </div>
      )}
      <div className="mt-3 flex gap-2">
        {CHALLENGES.map((c) => {
          const done = refuelsTogether >= c.at;
          return (
            <div
              key={c.at}
              className={`flex flex-1 flex-col items-center rounded-xl border py-2 text-[12px] ${
                done ? 'border-disa-green bg-[#E3F3EA] text-disa-green' : 'border-disa-line text-disa-gray'
              }`}
            >
              <span className="text-[18px]">{PRIZE_EMOJI[c.prize]}</span>
              <span className="font-bold">{c.at}</span>
              <span className="flex items-center gap-0.5">{done ? <Check size={12} /> : <Gift size={12} />} {c.prize}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
