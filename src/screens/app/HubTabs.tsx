import { Award, ChevronRight, Lock, Sparkles, Sun } from 'lucide-react';
import { Challenge } from '../../components/Challenge';
import { Coupon } from '../../components/Coupon';
import { FriendsRanking, GroupLeague } from '../../components/Ranking';
import { MysteryStationCard, StationExplorerCard } from '../../components/StationChallenges';
import { StreakBar } from '../../components/StreakBar';
import { Card, Chip, ProgressBar } from '../../components/ui';
import { ACHIEVEMENTS, AI_GROUP_TIP, AI_STREAK_TIP, GROUP } from '../../data/challenges';
import { FRIENDS_RANKING } from '../../data/rankings';
import { SUMMER_CHALLENGE, SUMMER_WRAPPED } from '../../data/summer';
import { DRIVER_ID, getUser, type UserId } from '../../data/users';
import { completedChallenge, enteredMysteryDraw, groupRefuels, prizesFor } from '../../lib/prizes';
import { useDemoStore } from '../../store/demoStore';

// Badge unlocked by the demo refuel: Lucía becomes "Conductora del mes".
const MONTH_BADGE = ACHIEVEMENTS[ACHIEVEMENTS.length - 1];

function AiTip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl bg-[#E6EEF8] p-3 text-[13px] text-disa-blue">
      <Sparkles size={16} className="mt-0.5 shrink-0" />
      <span>
        <b>Reto personalizado (IA):</b> {text}
      </span>
    </div>
  );
}

export function SummerEntry({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-disa-blue to-[#2C6CB5] p-4 text-left text-white">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-disa-yellow text-disa-ink">
        <Sun size={24} />
      </span>
      <span className="flex-1">
        <span className="block font-display text-[18px] font-semibold">{SUMMER_WRAPPED.title}</span>
        <span className="block text-[12px] text-white/80">
          {SUMMER_WRAPPED.refuelsTogether} repostajes juntos · tarjeta para compartir
        </span>
      </span>
      <ChevronRight size={22} />
    </button>
  );
}

export function RetosTab({ userId, onOpenSummer }: { userId: UserId; onOpenSummer: () => void }) {
  const state = useDemoStore();
  const refuels = groupRefuels(state);
  const done = completedChallenge(state);
  const memberNames = GROUP.copilots.map((id) => getUser(id as UserId).name);
  const isDriver = userId === DRIVER_ID;
  return (
    <div className="space-y-3">
      {isDriver && <SummerEntry onOpen={onOpenSummer} />}
      <AiTip text={done ? AI_STREAK_TIP : AI_GROUP_TIP} />
      <Challenge refuelsTogether={refuels} memberNames={memberNames} justCompleted={Boolean(done)} />
      <MysteryStationCard entered={enteredMysteryDraw(state)} />
      <StationExplorerCard />
      <StreakBar />
      <Card>
        <div className="mb-1 flex items-center justify-between">
          <p className="font-display text-[17px] font-semibold">Reto de Verano</p>
          <Chip tone="gray">{SUMMER_CHALLENGE.season}</Chip>
        </div>
        <p className="mb-2 text-[13px] text-disa-gray">
          <b className="text-disa-ink">{SUMMER_CHALLENGE.refuelsTogether}</b> repostajes juntos
        </p>
        <ProgressBar value={SUMMER_CHALLENGE.refuelsTogether} max={SUMMER_CHALLENGE.milestones[SUMMER_CHALLENGE.milestones.length - 1]} tone="blue" />
        <div className="mt-1 flex justify-between text-[12px]">
          {SUMMER_CHALLENGE.milestones.map((m) => (
            <span key={m} className={SUMMER_CHALLENGE.reached.includes(m) ? 'font-bold text-disa-green' : 'text-disa-gray'}>
              {SUMMER_CHALLENGE.reached.includes(m) ? '✓ ' : ''}
              {m}
            </span>
          ))}
        </div>
      </Card>
      {isDriver && (
        <Card>
          <p className="mb-2 font-display text-[17px] font-semibold">Logros</p>
          <div className="grid grid-cols-2 gap-2">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = a !== MONTH_BADGE || state.phase === 'done';
              return (
                <div
                  key={a}
                  className={`flex items-center gap-2 rounded-xl p-2 text-[12px] ${
                    unlocked ? 'bg-[#FFF4D1] text-disa-ink' : 'bg-disa-bg text-disa-gray'
                  } ${unlocked && a === MONTH_BADGE ? 'animate-pop' : ''}`}
                >
                  {unlocked ? <Award size={18} className="shrink-0 text-[#B8860B]" /> : <Lock size={16} className="shrink-0" />}
                  <span className="font-medium leading-tight">{a}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export function RankingTab() {
  const phase = useDemoStore((s) => s.phase);
  const driverName = getUser(DRIVER_ID).name;
  const isListed = FRIENDS_RANKING.some((r) => r.name === driverName);
  return (
    <div className="space-y-3">
      <FriendsRanking pendingRefuel={phase !== 'done' && isListed} driverName={driverName} />
      <GroupLeague />
      <p className="px-2 text-center text-[11px] text-disa-gray">Se compite por grupos y entre amigos. Las temporadas se reinician.</p>
    </div>
  );
}

export function PremiosTab({ userId }: { userId: UserId }) {
  const state = useDemoStore();
  const prizes = prizesFor(state, userId);
  if (prizes.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-[36px]">🎁</p>
        <p className="font-display text-[18px] font-medium text-disa-blue">Aquí verás tus premios</p>
        <p className="text-[13px] text-disa-gray">Chicles, papas, café, refresco, helado… y a veces cine o conciertos.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {prizes.map((p) => (
        <Coupon key={p.id} prize={p} userId={userId} />
      ))}
    </div>
  );
}
