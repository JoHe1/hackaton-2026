import { Flame, ShieldCheck } from 'lucide-react';
import { STREAK, STREAK_MILESTONES } from '../data/streaks';
import { Card, Chip } from './ui';

/** Weekends in a row with a full car (3 copilots), with one joker per season. */
export function StreakBar() {
  const slots = Array.from({ length: STREAK.nextPrize.at }, (_, i) => i + 1);
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4D1] text-[#E8572A]">
            <Flame size={22} />
          </span>
          <div>
            <p className="font-display text-[17px] font-semibold">Racha: {STREAK.weekendsFullCar} fines de semana</p>
            <p className="text-[12px] text-disa-gray">con el coche lleno · récord {STREAK.best}</p>
          </div>
        </div>
        <Chip tone="green">
          <ShieldCheck size={12} /> {STREAK.jokersLeft} comodín
        </Chip>
      </div>
      <div className="mt-3 flex gap-1.5">
        {slots.map((n) => {
          const done = n <= STREAK.weekendsFullCar;
          const milestone = STREAK_MILESTONES.find((m) => m.at === n);
          return (
            <div key={n} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-full items-center justify-center rounded-md text-[13px] font-bold ${
                  done ? 'bg-disa-yellow text-disa-ink' : 'bg-disa-bg text-disa-gray'
                } ${milestone ? 'ring-2 ring-disa-blue/40' : ''}`}
              >
                {done ? <Flame size={14} /> : n}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[12px] text-disa-gray">
        Próximo premio a los {STREAK.nextPrize.at} findes: <b className="text-disa-blue">{STREAK.nextPrize.prize}</b>
      </p>
    </Card>
  );
}
