import { CHALLENGES, GROUP } from '../data/challenges';
import { COPILOT_REWARDS, DRIVER_SPIN_RESULT, PARTNER_PRIZES, PRIZE_EMOJI } from '../data/rewards';
import { MYSTERY_STATION } from '../data/explorer';
import { DEMO_TICKET } from '../data/ticket';
import { DRIVER_ID, type UserId } from '../data/users';
import { isRewardUnlocked, type DemoData } from '../store/demoStore';

export interface Prize {
  id: string;
  title: string;
  emoji: string;
  source: string;
  why?: string;
  partner: boolean;
  /** Replaces the default "redeem in store" footer (e.g. a draw entry). */
  footer?: string;
}

/** Refuels together including the one made during the demo. */
export function groupRefuels(state: DemoData): number {
  return GROUP.refuelsTogether + (state.phase === 'done' ? 1 : 0);
}

/** The group challenge reached by the demo refuel, if any. */
export function completedChallenge(state: DemoData) {
  if (state.phase !== 'done') return undefined;
  return CHALLENGES.find((c) => c.at === groupRefuels(state));
}

/** True once the group has refuelled at this week's mystery station (the demo refuel). */
export function enteredMysteryDraw(state: DemoData): boolean {
  return state.phase === 'done' && DEMO_TICKET.station === MYSTERY_STATION.stationId;
}

const makePrize = (id: string, title: string, source: string, why?: string): Prize => ({
  id,
  title,
  emoji: PRIZE_EMOJI[title] ?? '🎁',
  source,
  why,
  partner: PARTNER_PRIZES.includes(title),
});

const mysteryDrawEntry = (): Prize => ({
  id: 'mystery-draw',
  title: MYSTERY_STATION.prize,
  emoji: '✈️',
  source: `Gasolinera sorpresa · ${MYSTERY_STATION.week}`,
  partner: MYSTERY_STATION.partner,
  footer: `Participación en el sorteo del ${MYSTERY_STATION.drawDate}`,
});

export function prizesFor(state: DemoData, userId: UserId): Prize[] {
  const prizes: Prize[] = [];
  if (userId === DRIVER_ID && state.driverSpinsUsed > 0) {
    prizes.push(makePrize('driver-spin', DRIVER_SPIN_RESULT, 'Ruleta del conductor'));
  }
  const reward = COPILOT_REWARDS[userId];
  if (reward && isRewardUnlocked(state, userId) && (reward.type === 'cupon' || state.spun[userId])) {
    prizes.push(makePrize(`copilot-${userId}`, reward.result, reward.type === 'cupon' ? 'Cupón directo' : 'Ruleta de copiloto', reward.why));
  }
  const challenge = completedChallenge(state);
  const inGroup = userId === DRIVER_ID || state.joined.includes(userId);
  if (challenge && inGroup) {
    prizes.push(makePrize(`challenge-${challenge.at}`, challenge.prize, `Reto del grupo · ${challenge.at} repostajes juntos`));
  }
  if (inGroup && enteredMysteryDraw(state)) prizes.push(mysteryDrawEntry());
  return prizes;
}

export function couponCode(userId: UserId, prize: Prize): string {
  return `DISA-COP-${userId.toUpperCase()}-${prize.id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase()}`;
}
