import { Crown, MapPin, Trophy } from 'lucide-react';
import { FRIENDS_RANKING, GROUP_LEAGUE, RANKING_MONTH } from '../data/rankings';
import { Card, Chip } from './ui';

interface FriendsProps {
  /** The current demo refuel is still pending → the driver has one less and no badge yet. */
  pendingRefuel: boolean;
  driverName: string;
}

export function FriendsRanking({ pendingRefuel, driverName }: FriendsProps) {
  const rows = FRIENDS_RANKING.map((row) =>
    row.name === driverName && pendingRefuel ? { ...row, refuels: row.refuels - 1, badge: undefined } : row,
  );
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-[17px] font-semibold">Ranking entre amigos</p>
        <Chip tone="gray">{RANKING_MONTH}</Chip>
      </div>
      <ol className="space-y-2">
        {rows.map((row, i) => (
          <li
            key={row.name}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 ${row.name === driverName ? 'bg-[#E6EEF8]' : ''}`}
          >
            <span className={`w-5 text-center font-display text-[18px] font-bold ${i === 0 ? 'text-disa-yellow' : 'text-disa-gray'}`}>
              {i + 1}
            </span>
            <span className="flex-1">
              <span className="font-medium">{row.name}</span>
              {row.badge && (
                <span className="animate-pop ml-2 inline-flex items-center gap-1 rounded-full bg-disa-yellow px-2 py-0.5 text-[11px] font-bold">
                  <Crown size={11} /> {row.badge}
                </span>
              )}
            </span>
            <span className="text-[13px] text-disa-gray">
              <b className="text-disa-ink">{row.refuels}</b> repostajes
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[11px] text-disa-gray">Solo ves a tu círculo de amigos. Repostajes con copilotos este mes.</p>
    </Card>
  );
}

export function GroupLeague() {
  return (
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <p className="font-display text-[17px] font-semibold">Liga de {GROUP_LEAGUE.island}</p>
        <Chip tone="blue">
          <MapPin size={11} /> {GROUP_LEAGUE.season}
        </Chip>
      </div>
      <p className="mb-3 text-[12px] text-disa-gray">Grupos con alias · repostajes juntos en la temporada</p>
      <ol className="space-y-2">
        {GROUP_LEAGUE.table.map((row, i) => {
          const mine = row.alias.includes('tu grupo');
          return (
            <li key={row.alias} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${mine ? 'bg-[#FFF4D1]' : 'bg-disa-bg'}`}>
              <span className="w-5 text-center font-display text-[18px] font-bold text-disa-blue">{i + 1}</span>
              <span className={`flex-1 text-[14px] ${mine ? 'font-bold' : ''}`}>{row.alias}</span>
              <span className="text-[13px] font-bold">{row.refuels}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 flex items-center gap-1.5 text-[12px] text-disa-blue">
        <Trophy size={14} /> {GROUP_LEAGUE.prize}
      </p>
    </Card>
  );
}
