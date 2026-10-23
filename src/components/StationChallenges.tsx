import { Dices, MapPin, Medal, PartyPopper } from 'lucide-react';
import { MYSTERY_STATION, STATION_EXPLORER } from '../data/explorer';
import { STATIONS } from '../data/stations';
import { formatKm } from '../lib/format';
import { Card, Chip, ProgressBar } from './ui';

const mysteryStation = STATIONS.find((s) => s.id === MYSTERY_STATION.stationId) ?? STATIONS[0];

/** Random weekly station: refuelling there with a valid pass enters the whole car in a draw. */
export function MysteryStationCard({ entered }: { entered: boolean }) {
  return (
    <Card className={`relative overflow-hidden ${entered ? 'border-disa-green ring-2 ring-disa-green/30' : 'border-disa-yellow'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-disa-yellow text-disa-ink">
            <Dices size={22} />
          </span>
          <div>
            <p className="font-display text-[17px] font-semibold">Gasolinera sorpresa</p>
            <p className="text-[12px] text-disa-gray">Reto al azar · {MYSTERY_STATION.week}</p>
          </div>
        </div>
        {MYSTERY_STATION.partner && <Chip tone="yellow">Socio</Chip>}
      </div>
      <p className="mt-3 flex items-center gap-1.5 font-display text-[20px] font-semibold text-disa-blue">
        <MapPin size={18} /> {mysteryStation.name}
        <span className="text-[13px] font-normal text-disa-gray">· {formatKm(mysteryStation.km)}</span>
      </p>
      {entered ? (
        <div className="animate-pop mt-3 flex items-center gap-3 rounded-xl bg-[#E3F3EA] p-3 text-disa-green">
          <PartyPopper size={26} className="shrink-0" />
          <div>
            <p className="font-display text-[17px] font-bold leading-tight">¡Estáis dentro del sorteo!</p>
            <p className="text-[12px]">
              {MYSTERY_STATION.prize} · sorteo el {MYSTERY_STATION.drawDate}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[13px] text-disa-ink">
          Reposta aquí con tu pase de copilotos esta semana y entráis todos en el sorteo de{' '}
          <b>✈️ {MYSTERY_STATION.prize}</b>.
        </p>
      )}
    </Card>
  );
}

/** Distinct DISA stations where the group refuelled together (valid pass only). */
export function StationExplorerCard() {
  const { distinctStations, milestones } = STATION_EXPLORER;
  const next = milestones.find((m) => distinctStations < m.at) ?? milestones[milestones.length - 1];
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-[17px] font-semibold">Explorador de gasolineras</p>
          <p className="text-[12px] text-disa-gray">Gasolineras DISA distintas repostando juntos</p>
        </div>
        <Chip tone="blue">Con pase</Chip>
      </div>
      <div className="mb-1 mt-3 flex justify-between text-[13px]">
        <span className="font-bold text-disa-blue">
          {distinctStations}/{next.at} gasolineras
        </span>
        <span className="text-disa-gray">→ {next.badge}</span>
      </div>
      <ProgressBar value={distinctStations} max={next.at} tone="blue" />
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {milestones.map((m) => {
          const reached = distinctStations >= m.at;
          return (
            <div
              key={m.at}
              className={`flex flex-col items-center rounded-xl px-1 py-2 text-center ${
                reached ? 'bg-[#FFF4D1] text-disa-ink' : 'bg-disa-bg text-disa-gray'
              }`}
            >
              <Medal size={18} className={reached ? 'text-[#B8860B]' : ''} />
              <span className="font-display text-[16px] font-bold leading-none">{m.at}</span>
              <span className="mt-0.5 text-[10px] leading-tight">{m.badge}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
