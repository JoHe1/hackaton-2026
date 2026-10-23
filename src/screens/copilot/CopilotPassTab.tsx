import { Lock, ScanLine } from 'lucide-react';
import { Avatar } from '../../components/Avatar';
import { Coupon } from '../../components/Coupon';
import { PassCard } from '../../components/PassCard';
import { Wheel } from '../../components/Wheel';
import { Card, Chip, PrimaryButton } from '../../components/ui';
import { COPILOT_REWARDS } from '../../data/rewards';
import { SECURITY_MESSAGES } from '../../data/security';
import { DRIVER_ID, getUser, type UserId } from '../../data/users';
import { prizesFor } from '../../lib/prizes';
import { useNow } from '../../lib/useNow';
import { isRewardUnlocked, passRemainingSeconds, useDemoStore } from '../../store/demoStore';

export function CopilotPassTab({ userId }: { userId: UserId }) {
  const state = useDemoStore();
  const now = useNow();
  const setNav = useDemoStore((s) => s.setNav);
  const driver = getUser(DRIVER_ID);
  const joined = state.joined.includes(userId);

  if (!joined) {
    return (
      <div className="space-y-4">
        <Card className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E6EEF8] text-disa-blue">
            <ScanLine size={34} />
          </span>
          <p className="mt-3 font-display text-[20px] font-semibold text-disa-blue">¿Vas de copiloto?</p>
          <p className="mt-1 text-[14px] text-disa-gray">Escanea el QR del móvil de quien conduce. Tú ganas un premio y él o ella paga menos.</p>
        </Card>
        <PrimaryButton onClick={() => setNav(userId, { overlay: 'scanner' })}>Escanear QR</PrimaryButton>
      </div>
    );
  }

  if (isRewardUnlocked(state, userId)) return <UnlockedReward userId={userId} />;

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-3">
        <Avatar userId={DRIVER_ID} size={48} />
        <div>
          <p className="font-display text-[18px] font-semibold">Te has unido al coche de {driver.name}</p>
          <p className="text-[13px] text-disa-gray">{driver.car}</p>
        </div>
      </Card>
      {state.phase === 'pass' ? (
        <PassCard driverId={DRIVER_ID} copilots={state.joined} remainingSeconds={passRemainingSeconds(state, now)} />
      ) : (
        <Card>
          <p className="text-[14px] text-disa-gray">Esperando a que {driver.name} cree el pase…</p>
        </Card>
      )}
      <Card className="relative overflow-hidden">
        <div aria-hidden className="flex items-center gap-3 opacity-25 blur-[3px]">
          <span className="text-[44px]">🎁</span>
          <div>
            <p className="font-display text-[20px] font-semibold">Tu premio</p>
            <p className="text-[13px]">Ruleta o cupón para la tienda</p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white/80 px-6 text-center">
          <Lock size={20} className="shrink-0 text-disa-blue" />
          <span className="font-medium text-disa-blue">{SECURITY_MESSAGES.locked}</span>
        </div>
      </Card>
    </div>
  );
}

function UnlockedReward({ userId }: { userId: UserId }) {
  const state = useDemoStore();
  const markSpun = useDemoStore((s) => s.markCopilotSpun);
  const reward = COPILOT_REWARDS[userId];
  if (!reward) return null;
  const prize = prizesFor(state, userId).find((p) => p.id === `copilot-${userId}`);
  const spun = Boolean(state.spun[userId]);

  if (reward.type === 'cupon') {
    return (
      <div className="space-y-4">
        <Card className="text-center">
          <Chip tone="green">Premio desbloqueado</Chip>
          <p className="mt-2 font-display text-[22px] font-bold text-disa-blue">¡Tienes un cupón directo!</p>
        </Card>
        {prize && <Coupon prize={prize} userId={userId} highlight />}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-col items-center">
        <Chip tone="green">Premio desbloqueado</Chip>
        <p className="mb-3 mt-2 font-display text-[20px] font-bold text-disa-blue">Gira tu ruleta de copiloto</p>
        <Wheel result={reward.result} alreadySpun={spun} onDone={() => markSpun(userId)} size={240} />
      </Card>
      {spun && prize && (
        <div className="relative">
          {prize.partner && <Confetti />}
          <p className="animate-pop mb-2 text-center font-display text-[24px] font-bold">
            {prize.emoji} ¡{prize.title}!
          </p>
          <Coupon prize={prize} userId={userId} highlight />
        </div>
      )}
    </div>
  );
}

const CONFETTI_COLORS = ['#F6CC19', '#1D5798', '#0A8247', '#E8572A'];

function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-64 h-0">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className="absolute block h-2.5 w-1.5 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animation: `confetti-fall ${1.6 + (i % 5) * 0.25}s ease-in ${(i % 7) * 0.08}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
